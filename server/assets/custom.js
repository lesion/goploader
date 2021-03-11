var button = $("#upload-form")
var result = $("#upload-result")
var loader = $("#upload-loader")
var again = $('#upload-again')

var inputFile = document.getElementById("upload-file")
var upload = document.getElementById('upload')

var maxSize = 1024*1024*500 // 500Mb
var clipboard = new Clipboard('#upload-clipboard')

upload.ondrop = drop
upload.ondragover = dragOverHandler
button.click(chooseFile)

again.click(function() {
    result.fadeOut(400, function () {
        button.html(`<input type='hidden' name='duration' value='1w' />
            <input type="file" name="file" id="upload-file" class="inputfile" />
        <i class="fa fa-upload" aria-hidden="true"></i>
        <p>Scegli un file…</p>
        <p id="upload-error" style="display: none;"></p>`)
        button.off('click', uploadFile)
        button.click(chooseFile)
        button.fadeIn()
        upload.ondrop = drop
        upload.ondragover = dragOverHandler
    })
})

function dragOverHandler(ev) {
    // TODO: change class
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault()
}
  

function drop ( ev ) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault()

    // TODO: check if multiple file

    if (ev.dataTransfer.items) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[0].kind === 'file') {
            var file = ev.dataTransfer.items[0].getAsFile();
            uploadFile(file)
        }
    } else {
      // Use DataTransfer interface to access the file(s)
        uploadFile(ev.dataTransfer.files[0])
    }    
}

function chooseFile( ev ){
    inputFile.click()
}

function uploadFile (file) {
    var data = new FormData()
    data.append('file', file)
    data.append('duration', '1w')

    var req = new XMLHttpRequest()
    
    req.upload.onprogress = function(evt) {
        if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            $(".progress>div").css("width", percentComplete+"%");
        }
    }

    req.onload = function(data) {
        upload.ondrop = undefined
        upload.ondragover = undefined
        var url = this.responseText
        $("#upload-url").html("Puoi trovare il tuo file qui:<br /><a id='final-url' href='" + url + "' target='_blank'>" + url + "</a>")

        $('#upload-clipboard').attr("data-clipboard-text", url)
        loader.fadeOut(400, function() {
            result.fadeIn(400, function() {
                $(".progress>div").css("width", "0%")
            })
        })
    }

    req.upload.onerror = function(e) {
        console.error('error ', e)
        console.error(xmlhttp)
    }
    req.open("POST", '/', true)
    button.fadeOut(400, function () {
        loader.fadeIn(400, function () { req.send(data) })
    })

}

inputFile.addEventListener('change', fileChoosen)

function fileChoosen (ev) {
    var file = ev.target.files[0]
    if (file.size > maxSize) {
        $('#upload').addClass('error')
        button.html('Il file che hai scelto è ' + humanSize(file.size) + ' il massimo è di ' + humanSize(maxSize))
        return
    }
    $('#upload').removeClass('error')
    uploadFile(inputFile.files[0])
}


function humanSize (byte) {
    if (byte < 1024**2) {
        return (byte/1024).toFixed(1) + 'Kb'
    } else {
        return (byte/(1024**2)).toFixed(1) + 'Mb'
    }
}
