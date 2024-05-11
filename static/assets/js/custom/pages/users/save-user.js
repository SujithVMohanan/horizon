"use strict";

// Class definition
var MCSaveUser = function () {
    var validator;
    const handleSubmit = () => {

        // Get elements
        const form = document.getElementById('create-or-update-user-form');
        const submitButton = document.getElementById('create-or-update-user-submit');

        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'full_name': {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    'username': {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    'email': {
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
                    'industry_type': {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    'mobile': {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },

                    'category[]': {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    'user_type': {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    'user_profile_image': {
                        validators: {
                            file: {
                                extension: 'jpg,jpeg,png',
                                type: 'image/jpeg,image/png',
                                maxSize: 1024 * 1024, // Maximum file size in bytes (1 MB)
                                message: 'The selected file is not valid or is above 1 MB'
                            }
                        }
                    },
                    'user_cover_image': {
                        validators: {
                            file: {
                                extension: 'jpg,jpeg,png',
                                type: 'image/jpeg,image/png',
                                maxSize: 1024 * 1024, // Maximum file size in bytes (1 MB)
                                message: 'The selected file is not valid or is above 1 MB'
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


        submitButton.addEventListener('click', async e => {
            e.preventDefault();
        
            // Validate form before submit
            if (validator) {
                try {
                    const status = await validator.validate();
                    console.log('validated!');

                    const formData = new FormData();
                    formData.append('user_id', document.querySelector('[name="user_id"]').value);
                    // formData.append('date_of_birth', document.querySelector('[name="date_of_birth"]').value);
                    formData.append('user_type', document.querySelector('[name="user_type"]').value);
                    formData.append('password', document.querySelector('[name="password"]').value);
                    formData.append('mobile', document.querySelector('[name="mobile"]').value);
                    formData.append('email', document.querySelector('[name="email"]').value);
                    formData.append('industry_type', document.querySelector('[name="industry_type"]').value);
                    formData.append('category[]', document.querySelector('[name="category[]"]').value);
                    formData.append('username', document.querySelector('[name="username"]').value);
                    formData.append('full_name', document.querySelector('[name="full_name"]').value);
                    formData.append('user_status', document.querySelector('[name="user_status"]').value);
                    formData.append('user_cover_image', document.querySelector('[name="user_cover_image"]').files[0]);
                    formData.append('user_profile_image', document.querySelector('[name="user_profile_image"]').files[0]);
        
                    submitButton.setAttribute('data-kt-indicator', 'on');
                    submitButton.disabled = true;
        
                    if (status === 'Valid') {
                        const btn = document.getElementById('create-or-update-user-submit');
                        const loadingBtn = document.getElementById('banner-loader-text');

                        btn.style.display = 'none';
                        loadingBtn.style.display = 'inline-block';
        
                        const response = await fetch(api_config.create_or_update_from, {
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': api_config.csrfmiddlewaretoken,
                            },
                            body: formData,
                        });

                        const responseData = await response.json();  // Read the response body as JSON
        
                        if (responseData.status === 200) {
                            const redirectUrl = form.getAttribute('data-redirect-url');
                            if (redirectUrl) {
                                location.href = redirectUrl;
                            }
                        } else {
                            // Handle other cases if needed
                            submitButton.removeAttribute('data-kt-indicator');
                            btn.style.display = 'inline-block';
                            loadingBtn.style.display = 'none';
                            submitButton.disabled = false;
        
                            Swal.fire({
                                html: responseData.message || "please try again.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        }
                    } else {
                        submitButton.removeAttribute('data-kt-indicator');
                        submitButton.disabled = false;
        
                        Swal.fire({
                            html: responseData.message || "Sorry, looks like there are some errors detected, please try again.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                } catch (error) {
                    console.error( error);
                }
            }
        });
        
    }



    var handleOnChange = () =>{
        const onChangeFiledcategory = document.getElementsByName('category[]')
        $(onChangeFiledcategory).on('change', e => {
            validator.validate()
        })
    }



var field = document.querySelector('[name="username"]');
   field.addEventListener('keypress', function (event) {
        var key = event.keyCode;
        if (key === 32) {
            event.preventDefault();
        }
    });



    // Public methods
    return {
        init: function () {
            handleSubmit();
            handleOnChange();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    MCSaveUser.init();
});