document.addEventListener('DOMContentLoaded', () => {
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    );

    FilePond.setOptions({
        stylePanelAspectRatio: '150:100',
        imageResizeTargetWidth: 100,
        imageResizeTargetHeight: 150,
        stylePanelLayout: 'compact', 
        stylePanelMaxHeight: '300px', 
        stylePanelMaxWidth: '400px',


    })
    FilePond.parse(document.body);

});