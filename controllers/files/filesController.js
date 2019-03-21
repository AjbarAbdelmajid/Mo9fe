const fs = require('fs');
const models = require('../../models');
const images = models.files;



exports.delete_image_by_id = function (req, res) {
    let token = getToken(req.headers);
    if (token){
        if (req.params.file_id){
            images.findOne({
                where: {file_id: req.params.file_id }
            }).then((exist)=>{
                if (exist){
                    try {
                        fs.unlinkSync(exist.file_path)
                    } catch (err) {return console.error(err)}

                    //delete the image from data base
                    exist.destroy().then((destroyed)=>{
                        if (destroyed){
                            res.json({success: true, msg:'image is deleted'})
                        } else {
                            res.json({success: false, msg:'image is not deleted'})
                        }
                    }).catch((err)=>{throw Error(err)})
                } else {res.status(404).send({success: false, msg:'image is not deleted'})
                }
            }).catch((err)=>{throw Error(err)})
        }
    }
};

exports.deleteImages = function (whereToFind) {

    //find all model's images
    images.findAll({
        where: whereToFind
    }).then((model_images)=>{
        if (model_images){
            model_images.forEach((image)=>{

                //delete the image from the server's folder
                try {
                    fs.unlinkSync(image.file_path)
                } catch (err) {
                    return console.error(err)
                }

                //delete the image from data base
                image.destroy().then((destroyed)=>{
                    if (destroyed){
                        return console.log('image is destroyed')
                    } else {return console.log('image is not destroyed')}
                }).catch((err)=>{throw Error(err)})
            })

            //if there is no images
        }else{console.log('there is no images')}
    }).catch((err)=>{
        throw Error(err)
    })
};

function getToken(headers) {
    if(headers && headers.authorization){
        let token_parses = headers.authorization.split(' ');

        if(token_parses.length === 2){
            return token_parses
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}