var button = $("#upload-form")
var result = $("#upload-result")

var inputFile = document.getElementById("upload-file")
var loader = $("#upload-loader")
var again = $('#upload-again')

var maxSize = 1024*1024*500 // 500Mb
var clipboard = new Clipboard('#upload-clipboard')

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
    })
})

function chooseFile( ev ){
    inputFile.click()
}

function uploadFile () {
    var data = new FormData()
    data.append('file', inputFile.files[0])
    data.append('duration', '1w')

    var req = new XMLHttpRequest()
    
    req.upload.onprogress = function(evt) {
        if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            $(".progress>div").css("width", percentComplete+"%");
        }
        console.error(evt.loaded)
    }

    req.onload = function(data) {
        console.error(data)
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
    console.error('devo cominciare lupload')
    button.fadeOut(400, function () {
        loader.fadeIn(400, function () { req.send(data) })
    })

}

inputFile.addEventListener('change', fileChoosen)

function fileChoosen (ev) {
    var file = ev.target.files[0]
    var fileName = file.name
    if (file.size > maxSize) {
        $('#upload').addClass('error')
        button.html('Il file che hai scelto è ' + humanSize(file.size) + ' il massimo è di ' + humanSize(maxSize))
        return
    }
    $('#upload').removeClass('error')
    // scrivere nella label il nome del file selezionato e tipo "clicca per inviare"
    button.html('<span>' + fileName + ' (' + humanSize(file.size) + ')</span><br/> <h3>clicca per inviare</h3>')
    button.off('click', chooseFile)
    button.on('click', uploadFile)
    // 
}


function humanSize (byte) {
    if (byte < 1024**2) {
        return (byte/1024).toFixed(1) + 'Kb'
    } else {
        return (byte/(1024**2)).toFixed(1) + 'Mb'
    }
}
