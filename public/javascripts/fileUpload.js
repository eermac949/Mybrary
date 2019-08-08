const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--book-cover-width-large') != null && 
    rootStyles.getPropertyValue('--book-cover-width-large') !== '') {
    ready()
} else {
    // when it has loaded in yet
    document.getElementById('main-css')
    .addEventListener('load', ready)
}

function ready() {
    const coverWidth = parseFloat(
        rootStyles.getPropertyValue('--book-cover-width-large'))
    const coverAspectRatio = parseFloat(
        rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
    const coverheight = coverWidth / coverAspectRatio
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    );
        // need to get these values from our books.css
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverheight
    })

    FilePond.parse(document.body);
}