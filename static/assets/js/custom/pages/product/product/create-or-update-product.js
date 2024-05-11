"use strict";
window.addEventListener('load', function () {
    // Add an event listener to trigger validation on input change
    document.getElementById('contact_start_time_picker').addEventListener('input', validateTime);
    document.getElementById('contact_end_time_picker').addEventListener('input', validateTime);
    // Trigger validation on page load
    validateTime();
});

function validateTime() {
    var startTime = document.getElementById('contact_start_time_picker').value;
    var endTime = document.getElementById('contact_end_time_picker').value;
    var alertContainer = document.getElementById('alertContainer');

    // Remove existing alert message
    alertContainer.innerHTML = '';

    // Check if both times are the same
    if (startTime === endTime) {
        var alertMessage = document.createElement('div');
        alertMessage.className = 'alert alert-danger';
        alertMessage.innerHTML = 'Start time and end time cannot be the same. Please choose different times.';

        // Append the alert below the end time input
        alertContainer.appendChild(alertMessage);

        // You can also disable form submission or perform other actions here
    }
}


// Class definition
var MCUpdateOrCreateProduct = function () {

    

    var validator;

    var form;

    var categoryElement,brandElement, corporateElement;

    var dropZone_is;
    
    const handleSubmit = () => {
        

        // Get elements
        form = document.getElementById('create-or-update-product-form');
        const submitButton = document.getElementById('create-or-update-product-submit');



        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    name: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    corp_user: {
                        validators: {
                            notEmpty: {
                                enabled : true,
                                message: 'This field is required'
                            }
                        }
                    },
                    category: {
                        validators: {
                            notEmpty: {
                                enabled : true,
                                message: 'This field is required'
                            }
                        }
                    },
                    
                    product_address: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    price: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    
                    
                    contact_name: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            },
                        }
                    },
                    contact_number: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    contact_email: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            },
                            regexp: {
                                regexp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]/,
                                message: 'Please enter a valid email'
                            }
                        }
                    },
                    contact_start_time: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    contact_end_time: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            },
                        }
                    },
                    location: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    latitude: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    longitude: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    product_status: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    
                    
                    
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );


        submitButton.addEventListener('click', e => {
            e.preventDefault();

            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    
                    console.log('validated!');
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    submitButton.disabled = true;
                    
                   
                    if (status == 'Valid'& ($("#product_images_dropzone").find('img').length)>0) {

                        // Handle submit button
                        e.preventDefault();

                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable submit button whilst loading
                        submitButton.disabled = true;
                        submitButton.removeAttribute('data-kt-indicator');
                        // Enable submit button after loading
                        submitButton.disabled = false;

                        // Redirect to customers list page
                        form.submit();
                    } else {
                        submitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        submitButton.disabled = false;
                        Swal.fire({
                            html: "Sorry, looks like there are some errors detected, please try again.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            }
        });

    }




    var handleOnChange = () =>{
        const onChangeFiledcorporate_user = document.getElementsByName('corp_user')
        const onChangeFiledcategory = document.getElementsByName('category')
        const onChangeFiledlocation = document.getElementsByName('location')
        const onChangeFiledproduct_status = document.getElementsByName('product_status')
        $(onChangeFiledcorporate_user).on('change', e => {
            validator.validate()
        })
        $(onChangeFiledcategory).on('change', e => {
            validator.validate()
        })
        $(onChangeFiledlocation).on('change', e => {
            validator.validate()
        })
        $(onChangeFiledproduct_status).on('change', e => {
            validator.validate()
        })
    }
    






    const handleDropzone = () => {

        dropZone_is=false
        let ProductImageDropzone = new Dropzone("#product_images_dropzone", {
            url: `${api_config.product_image_upload_api_url}`,
            acceptedFiles: ".jpeg,.jpg,.png",
            maxFiles: 5,
            paramName: "file",
            maxFilesize: 10, // MB
            addRemoveLinks: true,
            accept: function(file, done) {
                done();
            },
            init: function() {

                this.on("maxfilesexceeded", function (data) {
                    let res = eval('(' + data.xhr.responseText + ')');
                });
                this.on("error", function (file, message) {
                    //this.removeFile(file);
                });
                this.on("sending", function(file, xhr, formData){
                    formData.append("uuid", `${api_config.uuid}`);
                    formData.append("csrfmiddlewaretoken", `${api_config.csrfmiddlewaretoken}`);
                    formData.append("files", file);
                    formData.append("module", 'product-images');
                });
                this.on("success", function(file, responseText) {
                    if(responseText.status_code == 200 && (ProductImageDropzone.files.length > 0 || $("#product_images_dropzone").find('img').length))
                    {
                        dropZone_is=true;
                        //element = file.previewElement.getElementsByTagName('a')?.[0];
                        //element.setAttribute('instance_id', responseText.data);
                        let childElements = file?.previewElement?.children;
                        childElements.forEach(childElement => {
                            childElement.setAttribute('instance_id', responseText.data);
                            childElement.setAttribute('action_type', 5);
                        });
                    }
                });
                this.on('removedfile', function(file) {
                    let removeElement = file.previewElement.getElementsByTagName('a')?.[0];
                    let instance_id = removeElement.getAttribute('instance_id')
                    let action_type = removeElement.getAttribute('action_type')
                    $.post(`${api_config.temporary_image_destroy_api_url}`, { id: instance_id, action_type:action_type }, 
                        function(data, status, xhr) {
                            if (ProductImageDropzone.files.length <= 0) {
                                dropZone_is = false
                                console.log(data)
                            }
                        
                            console.log(data)

                        }).done(function() { console.log('Request done!'); })
                        .fail(function(jqxhr, settings, ex) { console.log('failed, ' + ex); });

                }); 
            }
        });



        ProductImageDropzone.on("addedfile", file => {
            let instance_id = file?.instance_id;
            let childElements = file?.previewElement?.children;
            childElements.forEach(childElement => {
                childElement.setAttribute('instance_id', instance_id);
                childElement.setAttribute('action_type', 5);
            });
        });
        

        $.post(`${api_config.get_product_images_api_url}`, { product_id: `${api_config.product_id}` }, 
            function(data, status, xhr) {
                if(data.status_code == 200)
                {
                    $.each(data.data, function (key,value) {
                        var mockFile = { name: value.image_name, size: value.size, instance_id: value.id};
                        ProductImageDropzone.emit("addedfile", mockFile);
                        generateBase64encodedURL(value.image, function(dataURL){ 
                            ProductImageDropzone.emit("thumbnail", mockFile, dataURL)
                        })
                        ProductImageDropzone.emit("complete", mockFile);
                       
                    });
                    
                }
                

            }
        ).done(function() { console.log('Request done!'); 
        }).fail(function(jqxhr, settings, ex) { console.log('failed, ' + ex); });
    }





    const handleSelectOnChnage = () => {
        
        if(typeof api_config?.data?.category_id  !== 'undefined')
        {
            generateSelectOptionElement({pk:api_config?.data?.category_id, api_url : `${api_config.get_category_brands}`, tagElement: brandElement, elementEdit_id: api_config?.data?.brand_id})
        }
        
        $(categoryElement).on('change', e => {
            handleResetSelectOptions({elements: {brandElement}})
            generateSelectOptionElement({pk:e.target.value, api_url : `${api_config.get_category_brands}`,tagElement: brandElement})
            
        });
    }


    const handleResetSelectOptions = ({elements}) => {
        let emptyElement = document.createElement('option')
        $.each(elements, function (key,element) {
            element.innerHTML  = emptyElement
            element.dispatchEvent(new Event('change'));
        })
    }

    const generateSelectOptionElement = ({pk,api_url,tagElement, elementEdit_id = null }) => {
        if(pk) {
            $.post(api_url, { pk: pk }, function(response, status, xhr) {
                if(response?.status_code == 200)
                {
                    let subOptionElement = document.createElement('option')
                    tagElement.appendChild(subOptionElement);
                    $.each(response?.data, function (key,value) {
                        let subOptionElement = document.createElement('option')
                        //
                        if(elementEdit_id === value?.id)
                        {
                            subOptionElement.setAttribute('selected','selected')
                        }
                        //
                        subOptionElement.value = value?.id
                        subOptionElement.innerHTML = value?.name
                        tagElement.appendChild(subOptionElement);
                    });
                }
            
            }).done(function() { console.log('Request done!'); 
            }).fail(function(jqxhr, settings, ex) { console.log('failed, ' + ex); });
        }
    }








    
    // Public methods
    return {
        init: function () {

            categoryElement = document.querySelector('[data-control-select-option="category"]')
            corporateElement = document.querySelector('[data-control-select-option="corp_user"]')
            brandElement = document.querySelector('[data-control-select-option="brand"]')

            handleSubmit();
            
            handleDropzone();
            handleSelectOnChnage();
            handleOnChange();

            google.maps.event.addDomListener(window, 'load', initialize);
            
        }
    };
}();




// On document ready
KTUtil.onDOMContentLoaded(function () {
    MCUpdateOrCreateProduct.init();
});




function generateBase64encodedURL(src, callback){
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function(){
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      //canvas.height = this.naturalHeight;
      canvas.height = 140;
      canvas.width = 140;
      //canvas.width = this.naturalWidth;
      context.drawImage(this, 0, 0,140,140);
      var dataURL = canvas.toDataURL('image/jpeg');
      callback(dataURL);
    };
    image.src = src;
}




 

                                         
                                         

function initializeMap(lat_val='',long_val='') {

   
    let latitude = document.querySelector('[data-google-location="latitude"]')
    let longitude = document.querySelector('[data-google-location="longitude"]')
   // let place = document.querySelector('[data-google-place="place"]')
    
    
    

    if (lat_val != '' & long_val != '')
    {
        var myLatlngPoint = new google.maps.LatLng(lat_val,long_val)
        
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 18,
            center: myLatlngPoint,
        });

        google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
            
            map.setZoom(18);
            
          });
          
    }
    else if((typeof api_config?.data?.latitude !== 'undefined' && api_config?.data?.latitude !== '') && (typeof api_config?.data?.longitude !== 'undefined' && api_config?.data?.longitude !== ''))
    {
        var myLatlngPoint = new google.maps.LatLng(parseFloat(api_config?.data?.latitude), parseFloat(api_config?.data?.longitude))
       
        var map = new google.maps.Map(document.getElementById("map"), {
            center: myLatlngPoint,
            zoom:18
        }); 
        google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        
            map.setZoom(18);
            infoWindow.open(map);
            infoWindow.close();
          });
        

    }else{
        
        var mapOptions = {
            styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]}]
          };
        var myLatlngPoint = new google.maps.LatLng(25.168156257023266,51.217586634374996)
        var map = new google.maps.Map(document.getElementById("map"), {   
            zoom: 9,
            center: myLatlngPoint,
        },mapOptions);
    }
    var infoWindow = new google.maps.InfoWindow({
      //  content: "Click the map to get Lat/Lng!",
        position: myLatlngPoint,
        
    
    });
    // infoWindow.close();
    

    
    

    const marker = new google.maps.Marker({
        position: myLatlngPoint,
        map,
    });
   


    infoWindow.open({
        anchor: marker,
        map,
      });
      infoWindow.close();

    if((typeof api_config?.location_data?.latitude !== 'undefined' && api_config?.location_data?.latitude !== '') && (typeof api_config?.location_data?.longitude !== 'undefined' && api_config?.location_data?.longitude !== ''))
    {
       // infoWindow.setContent(JSON.stringify({ lat: api_config?.location_data?.latitude, lng:api_config?.location_data?.longitude }, null, 2));
        map.setZoom(9);
       // infoWindow.open(map);
    }

    map.addListener("click", function (mapsMouseEvent) {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        // infoWindow = new google.maps.InfoWindow({
        //     position: mapsMouseEvent.latLng,
        // });
        latitude.value = mapsMouseEvent.latLng.toJSON()?.lat
        longitude.value = mapsMouseEvent.latLng.toJSON()?.lng
        // infoWindow.setContent(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
        // infoWindow.open(map);
    });
}






function initialize() {
    var input = document.getElementById('place');
    
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        initializeMap(place.geometry['location'].lat(),place.geometry['location'].lng())
        document.getElementById("latitude").value = place.geometry['location'].lat();
        document.getElementById("longitude").value = place.geometry['location'].lng();
    });
}

