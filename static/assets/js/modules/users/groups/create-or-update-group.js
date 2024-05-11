"use strict";


$('input[name="group_name"]').on('keyup', function() {
    // Get the value from the input field
    var inputValue = $(this).val();
    
    // Check if the email is empty
    if (inputValue.trim() === '') {
        // Clear the error message, show the Save button, and enable form submission
        $('.error-message').text('');
        $('#create-or-update-roles-group-submit').show();
        $('form').off('submit');
        return;
    }

    var casestudyId = $('#casestudy_id').val();

    // Create the data object to send in the AJAX request
    var postData = {
        role_name: inputValue, // Change 'url' to 'email' for better clarity
        instance_id: casestudyId
    };

    // Cache the Save button element
    var saveButton = $('#create-or-update-roles-group-submit');

    // Make the AJAX POST request
    $.ajax({
        type: "POST",
        url: api_config.validation,
        data: postData,
        success: function(response) {
            // Handle the successful response here
            console.log("AJAX request successful:", response);

            // Check if the response indicates a duplicate email
            if (response.status_code === 400 && response.message === 'Title Already Exist') {
                // Display the error message
                $('.error-message').text('Title Already Exist');
                // Hide the Save button
                saveButton.hide();
                // Disable form submission
                $('form').on('submit', function(event) {
                    event.preventDefault();
                });
            } else {
                // Clear the error message, show the Save button, and enable form submission
                $('.error-message').text('');
                saveButton.show();
                $('form').off('submit');
            }
        },
        error: function(error) {
            // Handle any errors here
            console.error("AJAX request error:", error);
        }
    });
});


// Class definition
var MCUpdateOrCreateGroup = function () {

    var validator;
    var form;


    const handleSubmit = () => {
        

        // Get elements
        form = document.getElementById('create-or-update-group-form');
        const submitButton = document.getElementById('create-or-update-roles-group-submit');

        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    group_name: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    role: {
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

                    if (status == 'Valid') {

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
        const onChangeFiledrole = document.getElementsByName('role')
        $(onChangeFiledrole).on('change', e => {
            validator.validate()
        })
    }




    
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
    MCUpdateOrCreateGroup.init();
});




