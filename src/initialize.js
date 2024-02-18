function initialize() {
    var zg = {
        context_new: Module.cwrap('zg_context_new', 'number', ['number', 'number', 'number', 'number', 'number']),
        context_new_graph_from_file: Module.cwrap('zg_context_new_graph_from_file', 'number', ['number', 'string', 'string']),
        graph_attach: Module.cwrap('zg_graph_attach', null, ['number']),
        context_process: Module.cwrap('zg_context_process', null, ['number', 'number', 'number']),
        context_delete: Module.cwrap('zg_context_delete', null, ['number']),
        context_send_messageV0: Module.cwrap('zg_context_send_messageV', null, ['number', 'string', 'number', 'string']),
        context_send_messageV1: Module.cwrap('zg_context_send_messageV', null, ['number', 'string', 'number', 'string', 'number']),

        //  ZGGraph *zg_context_new_empty_graph(ZGContext *context);
        context_new_empty_graph: Module.cwrap(
            'zg_context_new_empty_graph',
            'number',
            ['number']
        ),

        // ZGObject *zg_graph_add_new_object(ZGGraph *graph, const char *objectString, float canvasX, float canvasY);
        graph_add_new_object: Module.cwrap(
            'zg_graph_add_new_object',
            'number',
            ['number', 'string', 'number', 'number']
        ),

        // void zg_graph_add_connection(ZGGraph *graph, ZGObject *fromObject, int outletIndex, ZGObject *toObject, int inletIndex);
        graph_add_connection: Module.cwrap(
            'zg_graph_add_connection',
            null,
            ['number', 'number', 'number', 'number']
        ),
    }
    console.log(zg)

    var AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext == null) {
        console.error('Web Audio not supported.')
    }
    var audioContext = new AudioContext()

}

