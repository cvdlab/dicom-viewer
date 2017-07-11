var counter;
const dicom_map = new Map();

const oc = require('orthanc-client');
const client = new oc({
    url: 'http://localhost:8042',
    auth: {
        username: 'foo',
        password: 'bar'
    }
});

var exports = module.exports ={ };
exports.load_dicom = function() {

// Print
    console.log('');
    console.log('-----------------------------------------');

// Reference the dicomParser module
    var dicomParser = require('dicom-parser');

    var fs = require('fs');
    var path = require('path');

    var filePath = 'DICOM_test';

    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }
        counter = 0
        files.forEach(function (file, index) {
            // Make one pass and make the file complete
            var newfile = path.join(filePath, file);

            fs.stat(newfile, function (error, stat) {
                if (error) {
                    console.error("Error stating file.", error);
                }

                if (stat.isFile()) {
                    var dicomFileAsBuffer = fs.readFileSync(newfile);
                    client.instances.add(dicomFileAsBuffer)
                        .then(function(res){

                            if(res.Status === "AlreadyStored"){
                                console.log("Already Stored")
                            }
                            else{
                                console.log("'%s' added with ID '%s'", newfile, res.ID);
                            }
                            client.instances.get(res.ID)
                                .then(function (instance) {
                                    let i = parseInt(instance.MainDicomTags.InstanceNumber)
                                    dicom_map[i] = res.ID
                                    counter ++
                                    console.log(counter)
                                    //console.log("index '%d' with ID '%s'", i, res.ID);
                                })
                        })
                        .catch(function (err) {
                            console.log("ERROR: ADD DICOM AT INDEX "+ index + "\n")
                            console.log( err)
                        })

                }
                else if (stat.isDirectory())
                    console.log("'%s' is a directory.", newfile);
            });
        });
    });


    function parseDicomAsBuffer(dicomFileAsBuffer) {
        // Parse the dicom file
        try {
            var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);

// Get the pixel data element and calculate the SHA1 hash for its data
            var pixelData = dataSet.elements.x7fe00010;
            var pixelDataBuffer = dicomParser.sharedCopy(dicomFileAsBuffer, pixelData.dataOffset, pixelData.length);

        }
        catch (ex) {
            console.log(ex);
        }
    }
}();

exports.get_DICOM_image = function(slice_number){

    let id = dicom_map[slice_number]
    if(id!==undefined){
        return client.instances.getImage(id)
    }
    else{
        return client.instances.getImage(id+1)
    }



};
