var latex_to_text_map = {}
var latex_to_text_keys = []
var text_to_latex_map = {}
var text_to_latex_keys = []

var demo_text = 
`Apart from methods dedicated to addressing the weakness of pair-based DML methods, there is another line of work that tackles DML via class distribution estimation (See Figure~\\ref{fig:a}, \\ref{fig:b}, and \\ref{fig:c}). The motivation for this camp of thought is to compare samples to proxies, and in doing so, reduce computation.  One method that falls under this line of work is the Magnet Loss~\\cite{rippel2015metric}, in which samples are associated with a cluster centroid, and at each training batch, samples are attracted to cluster centroids of similar classes and repelled by cluster centroids of different classes. Another method in this camp is ProxyNCA~\\cite{movshovitz2017no}, where proxies are stored in memory as learnable parameters. During training, each sample is pushed towards its proxy while repelling against all other proxies of different classes. ProxyNCA is discussed in greater detail in Section~\\ref{sec:proxynca}.
`;

$(document).ready(function(){

    //$("#tabs").tabs()

    //$("textarea").val($("html").width());
    max_width = $("html").width()
    max_height = $("html").height()
    $(".panel-left").css('max-width', max_width);
    $(".panel-right").css('max-width', max_width);
   
    $(".panel-left").css('width', max_width/2.2); 
    //$(".panel-right").css('width', max_width - max_width/2.2); 
   
    $(".panel-left, .panel-right").css('height', max_height * 0.7)
    $(".panel-left, .panel-right").resizable({
       handleSelector: ".splitter",
       resizeHeight: false
    });

    $('#input1').val(demo_text)

    //main functionality
    $("#latex_to_text").click(function(){
        generate_map($("#input1").val());
        output = find_and_replace($("#input1").val(), latex_to_text_map, latex_to_text_keys)
        $("#output1").val(output)
    });

     $("#text_to_latex").click(function(){
        output = find_and_replace($("#output1").val(), text_to_latex_map, text_to_latex_keys)
        $("#input1").val(output)
    });
   

     $("#clear").click(function(){
        $("#input1").val('')
        $("#output1").val('')

    });


});

function find_and_replace(input, map, keys){
    for (ix=0; ix < keys.length; ix++) {
        input = input.replace(keys[ix], map[keys[ix]])
    }
    return input
}

function generate_map(input){

    function add_to_map(reg, template, count) {
        k = input.match(reg)
        if (k == null) {
            k_len = -1
        } else {
            k_len = k.length
        }

        for (ix=0; ix < k_len; ix++) {
            latex_to_text_map[k[ix]] = template(count)
            text_to_latex_map[template(count)] = k[ix]

            if (latex_to_text_keys.indexOf(k[ix]) == -1) {
                latex_to_text_keys.push(k[ix])
            }
            if (text_to_latex_keys.indexOf(template(count)) == -1) {
                text_to_latex_keys.push(template(count))
            }

            input = input.replace(k[ix], '')
            count += 1
        }
        return count
    }

    //matching: '~\cite{something}' to ' [${ix}]'
    reg = /(?:~\\cite)(.*?)}/g
    var count = 0
    template = function(count){ return ` [${count}]`}
    count = add_to_map(reg, template, count)

    //matching: '\cite{something}' to '[${ix}]'
    reg = /(?:\\cite)(.*?)}/g
    template = function(count){ return `[${count}]`}
    count = add_to_map(reg, template, count)

    //matching: '~\ref{something}' to ' A${ix}'
    count = 0
    template = function(count){ return ` A${count}`}
    reg = /(?:~\\ref)(.*?)}/g
    count = add_to_map(reg, template, count)

    //matching: '\ref{something}' to 'A${ix}'
    reg = /(?:\\ref)(.*?)}/g
    template = function(count){ return `A${count}`}
    count = add_to_map(reg, template, count)

}

