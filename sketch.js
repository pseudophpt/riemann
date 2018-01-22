const screen_width = 720;
const screen_height = 720;

const half_width = (screen_width / 2);
const half_height = (screen_height / 2);

const scale = 300;

const c1 = '#ffcc00';
const c2 = '#222222';
const c3 = '#22222240';

const partition = [-1.2, -1,-0.8, -0.4, 0, 0.6, 1.1, 1.2];

var minima = [];
var maxima = [];

var visible_minima = [];
var visible_maxima = [];

var cur_function = 0;
var funcs = [];
var func_names = [];

var current_partition = 0;

function get_lower () {
    var total = 0;
    
    for (var i = 0; i < partition.length - 1; i ++) {
        var width = partition[i + 1] - partition[i];
        
        var min = visible_minima[i];
        
        total += min;
    }
    
    return total;
}

function get_upper () {
    var total = 0;
    
    for (var i = 0; i < partition.length - 1; i ++) {
        var width = partition[i + 1] - partition[i];
        
        var max = visible_maxima[i];
        
        total += max;
    }
    
    return total;
}

function round_thousandths (num) {
    return round(num * 1000) / 1000;
}

function update_visible () {
    /* Update visible minima and maxima */
    for (var i = 0; i < partition.length; i ++) {
        visible_minima[i] = (4 * visible_minima[i] + minima[i]) / 5;
        visible_maxima[i] = (4 * visible_maxima[i] + maxima[i]) / 5;
    }
}

function prev_function () {
    cur_function --;
    if (cur_function < 0) {
        cur_function = 0;
    }
    update_funcname ();
}

function next_function () {
    cur_function ++;
    if (cur_function >= funcs.length) {
        cur_function = funcs.length - 1;
    }
    update_funcname ();
}

function update_funcname () {
    /* Set function name */
    document.getElementById("function-name").innerHTML = func_names[cur_function];
}

function init_functions () {
    funcs.push(function (t) {
        return sin(t);
    });
    
    func_names.push('sin(x)');
    
    funcs.push(function (t) {
        return cos(t);
    });
    
    func_names.push('cos(x)');
    
    funcs.push(function (t) {
        return tan(t);
    });
    
    func_names.push('tan(x)');
    
    funcs.push(function (t) {
        return exp(t);
    });
    
    func_names.push('exp(x)');
    
    funcs.push(function (t) {
        return abs(t);
    });
    
    func_names.push('|x|');
    
    funcs.push(function (t) {
        return floor(2*t) / 2;
    });
    
    func_names.push('[2x]/2');
    
    funcs.push(function (t) {
        if (t == 0) return t;
        else return t*t*sin(1/t);
    });
    
    func_names.push('x<sup>2</sup> sin(1/x)');

}

function get_value (t) {
    return funcs[cur_function](t);
}

function update_extrema (x, y) {
    if (x > partition[current_partition + 1]) {
        current_partition ++;
        /* Add first value as placeholder */
        minima.push(get_value(partition[current_partition]));
        maxima.push(get_value(partition[current_partition]));
    }
    
    if (y < minima [current_partition]) {
        minima [current_partition] = y;
    }
    
    if (y > maxima [current_partition]) {
        maxima [current_partition] = y;
    }
}

function setup () {
    createCanvas (screen_width, screen_height);
    
    init_functions ();
    for (var p of partition) {
        visible_minima.push(0);
        visible_maxima.push(0);
    }
}

function draw () {
    background(0);
    strokeWeight(1);
    
    /* Axes */
    stroke(c2);
    
    line(0, half_height, screen_width, half_height); /* X */
    line(half_width, 0, half_width, screen_height); /* Y */
    
    /* Function */
    stroke(c1);
    
    minima = [get_value(partition[0])];
    maxima = [get_value(partition[0])];
    
    current_partition = 0;
    
    for (var i = 0; i < screen_width; i ++) {
        /* i and j are screen pixels, x and y are mathematical points */
        var x = (i - half_width) / scale;
        var y = get_value(x);
        var j = half_height - (y * scale);
        point (i, j);
        
        /* Now that we've drawn, let's update extrema */
        update_extrema (x, y);
    }
    
    /* Draw "squares" */
    
    for (var i = 1; i < partition.length; i ++) {
        var x = partition[i - 1];
        var width = partition[i] - x;
        
        var y_min = visible_minima[i-1];
        var y_max = visible_maxima[i-1];
        
        var sx = (x * scale) + half_width;
        var swidth = width * scale;
        
        var sy_min = -y_min * scale;
        var sy_max = -y_max * scale;
        
        var height = sy_max - sy_min;
        
        noStroke();
        
        fill(c3);
        rect(sx, half_height + sy_min, swidth, height);
    }
    
    update_visible(); 
    
    var lower = get_lower ();
    var upper = get_upper ();
    
    var lower_str = "L(f, P) = " + round_thousandths(lower);
    var upper_str = "U(f, P) = " + round_thousandths(upper);
    var diff_str = "U(f, P) - L(f, P) = " + round_thousandths(upper - lower);
    
    fill(c1);
    text(lower_str, 10, 10);
    text(upper_str, 10, 30);
    text(diff_str, 10, 50);
}
