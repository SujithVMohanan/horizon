"use strict";

// Class definition
var DatatablesAndCRUDOperationServerSide = function() {


    // start datatable and deleteation section

    // Shared variables
    var table;
    var dt;

    // Private functions
    var initDatatable = function() {

        dt = $("#category-datatable").DataTable({
            searchDelay: 500,
            serverSide: true,
            responsive: true,
            processing: true,
            order: [
                [3, 'desc']
            ],
            select: {
                style: 'multi',
                selector: 'td:first-child input[type="checkbox"]',
                className: 'row-selected'
            },
            ajax: {
                method: "POST",
                url: `${api_config.datatable}`,
                data: {
                    'csrfmiddlewaretoken': `${api_config.csrfmiddlewaretoken}`,
                },
            },
            columns: [
                {data: 'id'},
                {data: 'name'},
                {data: 'created_at'},
                {data: 'updated_at'},
                {data: 'id'},
            ],
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    render: function (data) {
                        return `
                            <div class="form-check form-check-sm form-check-custom form-check-solid">
                                <input class="form-check-input checkbox-input-id" type="checkbox" value="${data}" />
                            </div>`;
                    }
                },
                {
                    searchable: true,
                    orderable: true,
                    targets: 1,
                    render: function(data, type, row) {
                        return `<div class="d-flex align-items-center">
                                    <div class="">
                                        <a href="javascript:void(0)" data-encrypt_id=${row.encrypt_id} data-category-table-update="update_row" class="text-gray-800 text-hover-primary fs-5 fw-bolder" >${data}</a>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: -1,
                    data: null,
                    orderable: false,
                    className: 'text-end',
                    render: function (data, type, row) {
                        var perm_value = document.getElementById("check_perm").value
                        if(perm_value){
                        
                        return `
                                <div class="d-flex justify-content-end flex-shrink-0">
                                    <a href="javascript:void(0)" data-encrypt_id=${row.encrypt_id} data-category-table-update="update_row" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                        <span class="svg-icon svg-icon-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor" />
                                                <path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </a>
                                    <a href="javascript:void(0)" data-id=${row.id} data-category-table-filter="delete_row" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                                        <span class="svg-icon svg-icon-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor" />
                                                <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor" />
                                                <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                        `;
                    }else{
                        return `<div class="d-flex justify-content-end flex-shrink-0">
                            <a href="javascript:void(0)" data-encrypt_id=${row.encrypt_id} data-category-table-update="update_row" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                <span class="svg-icon svg-icon-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor" />
                                        <path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor" />
                                    </svg>
                                </span>
                            </a>
                    </div>`;
                    }
                    },
                },
            ],
            // Add data-filter attribute
            drawCallback: function(settings) {},
            createdRow: function(row, data, dataIndex) {
                $(row).find('td:eq(4)').attr('data-filter', data.CreditCardType);
            }
        });
        table = dt.$;
        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        dt.on('draw', function() {
            initToggleToolbar();
            toggleToolbars();
            handleDeleteRows();
            handleProductCategoryUpdateRows();
            KTMenu.createInstances();
        });
       
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = function() {
        const filterSearch = document.querySelector('[data-category-table-filter="search"]');
        filterSearch.addEventListener('keyup', function(e) {
            dt.search(e.target.value).draw();
        });
    }

 
    
    // Delete customer
    var handleDeleteRows = () => {
        // Select all delete buttons
        const deleteButtons = document.querySelectorAll('[data-category-table-filter="delete_row"]');

        deleteButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function(e) {

                const destroyRecordIds = [$(this).data('id')];
                e.preventDefault();
                // Select parent row
                const parent = e.target.closest('tr');
                // Get customer name
                const category_name = parent.querySelectorAll('td')[1].innerText;

                //     // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Are you sure you want to delete " + category_name + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function(result) {
                    if (result.value) {
                        $.post(`${api_config.delete_records}`, { ids: destroyRecordIds }, function(data, status, xhr) {

                            if (data.status_code = 200) {
                                Swal.fire({
                                    text: "You have deleted " + category_name + "!.",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function() {
                                    // delete row data from server and re-draw datatable
                                    dt.draw();
                                });

                            } else {
                                Swal.fire({
                                    text: "Something went wrong.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                });
                            }

                        }, 'json').done(function() {
                            console.log('Request done!');
                        }).fail(function(jqxhr, settings, ex) {
                            console.log('failed, ' + ex);
                            Swal.fire({
                                text: "Something went wrong.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        });

                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: groupName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
        });
    }


    // Init toggle toolbar
    var initToggleToolbar = function() {
        // Toggle selected action toolbar
        // Select all checkboxes
        const container = document.querySelector('#category-datatable');
        const checkboxes = container.querySelectorAll('[type="checkbox"]');

        // Select elements
        const deleteSelected = document.querySelector('[data-category-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function() {
                setTimeout(function() {
                    toggleToolbars();
                }, 50);
            });
        });

        // Deleted selected rows
        deleteSelected.addEventListener('click', function() {

            const row_ids = []
            $(".checkbox-input-id:checkbox:checked").each(function() {
                console.log("lklk")
                row_ids.push($(this).val());
            });

            Swal.fire({
                text: "Are you sure you want to delete selected records?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                showLoaderOnConfirm: true,
                confirmButtonText: "Yes, delete!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                },
            }).then(function(result) {
                if (result.value) {

                    $.post(`${api_config.delete_records}`, { ids: row_ids }, function(data, status, xhr) {

                        if (data.status = 200) {
                            Swal.fire({
                                text: "You have deleted all selected records!.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            }).then(function() {
                                // delete row data from server and re-draw datatable
                                dt.draw();
                                const headerCheckbox = container.querySelectorAll('[type="checkbox"]')[0];
                                headerCheckbox.checked = false;
                            });

                        } else {
                            Swal.fire({
                                text: "Something went wrong.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        }

                    }, 'json').done(function() {
                        console.log('Request done!');
                    }).fail(function(jqxhr, settings, ex) {
                        console.log('failed, ' + ex);
                        Swal.fire({
                            text: "Something went wrong.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    });

                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Selected category was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        });
    }

    // Toggle toolbars
    var toggleToolbars = function() {
        // Define variables
        const container = document.querySelector('#category-datatable');
        const toolbarBase = document.querySelector('[data-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-category-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[ data-category-table-select="selected_count"]');

        // Select refreshed checkbox DOM elements
        const allCheckboxes = container.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }

        const headerCheckbox = container.querySelectorAll('[type="checkbox"]')[0];
        headerCheckbox.addEventListener('click', function() {
            allCheckboxes.forEach(c => {
            c.checked = headerCheckbox.checked;
            });
            checkedState = headerCheckbox.checked;
            count = headerCheckbox.checked ? allCheckboxes.length : 0;
            selectedCount.innerHTML = count;
            if (checkedState) {
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
            } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
            }
            });

        if (checkedState && count !== allCheckboxes.length) {
            headerCheckbox.checked = false;
            } else if (count === 0) { 
            headerCheckbox.checked = false;
            }
            else if (checkedState && count == allCheckboxes.length) {
                headerCheckbox.checked = true;
            }
    }



    var dataModelDismiss;
    var productCategoryModalsubmitButton;
	var productCategoryModalcancelButton;
	var productCategoryModalvalidator;
	var productCategoryModalForm;
	var modal;
	var modalEl;


    // Handle form validation and submittion
	
    // Handle form validation and submittion
	var handleProductCategoryCreateForm = function() {
		// Stepper custom navigation

		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		productCategoryModalvalidator = FormValidation.formValidation(
			productCategoryModalForm,
			{
				fields: {
					category_name: {
						validators: {
							notEmpty: {
								message: 'Category name is required'
							}
						}
					}
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

		// Action buttons
		productCategoryModalsubmitButton.addEventListener('click', function (e) {
			e.preventDefault();

			// Validate form before submit
			if (productCategoryModalvalidator) {
				productCategoryModalvalidator.validate().then(function (status) {
					

					if (status == 'Valid') {
						productCategoryModalsubmitButton.setAttribute('data-kt-indicator', 'on');

						// Disable button to avoid multiple click 
						productCategoryModalsubmitButton.disabled = true;


                        let category_name = productCategoryModalForm.querySelector('[name="category_name"]').value
                        let category_id = productCategoryModalForm.querySelector('[name="category_hidden_id"]').value
                        
                        $.post(`${api_config.create_or_update_category}`, { category_name: category_name,category_id:category_id  }, function(data, status, xhr) {
                            if (data.status_code = 200) {
                                productCategoryModalForm.querySelector('#create-new-category').innerHTML = "Create new category";
                                productCategoryModalForm.reset();
                                Swal.fire({
                                    text: category_name+ " category successfully "+data.action,
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        modal.hide();
                                    }
                                });

                            } else {
                                Swal.fire({
                                    text: "Something went wrong.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                });
                            }

                        }, 'json').done(function() {
                            dt.draw();
                            productCategoryModalsubmitButton.removeAttribute('data-kt-indicator');
							// Enable button
							productCategoryModalsubmitButton.disabled = false;
                        }).fail(function(jqxhr, settings, ex) {
                            console.log('failed, ' + ex);
                            Swal.fire({
                                text: "Something went wrong.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        });


   						
					} else {
						// Show error message.
						Swal.fire({
							text: "Sorry, looks like there are some errors detected, please try again.",
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

		productCategoryModalcancelButton.addEventListener('click', function (e) {
			Swal.fire({
				text: "Are you sure you would like to cancel?",
				icon: "warning",
				showCancelButton: true,
				buttonsStyling: true,
				confirmButtonText: "Yes, cancel it!",
				cancelButtonText: "No, return",
				customClass: {
					confirmButton: "btn btn-primary",
					cancelButton: "btn btn-active-light"
				}
			}).then(function (result) {
				if (result.value) {
                    productCategoryModalForm.querySelector('#create-new-category').innerHTML = "Create new category";
					productCategoryModalForm.reset(); // Reset form	
					modal.hide(); // Hide modal				
				} else if (result.dismiss === 'cancel') {
                    
					Swal.fire({
						text: "Your form has not been cancelled!.",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Ok, got it!",
						customClass: {
							confirmButton: "btn btn-primary",
						}
					});
				}
			});
		});
	}








    // Delete customer
    var handleProductCategoryUpdateRows = () => {
        // Select all update buttons
        const updateButtons = document.querySelectorAll('[data-category-table-update="update_row"]');

        updateButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function(e) {

                const updateRecordId = $(this).data('encrypt_id');

                e.preventDefault();
                const parent = e.target.closest('tr');
                const category_name = parent.querySelectorAll('td')[1].innerText;
                productCategoryModalForm.querySelector('[name="category_name"]').value = category_name;
                productCategoryModalForm.querySelector('[name="category_hidden_id"]').value = updateRecordId;
                productCategoryModalForm.querySelector('#create-new-category').innerHTML = "Update category";
                modal.show()
            })
        });
    }


    // end property category crud operation




    var handleDataModelDismiss = () => {
        
        dataModelDismiss.addEventListener('click', function () {
            setTimeout(function() {
                productCategoryModalForm.querySelector('#create-new-category').innerHTML = "Create new category";
                productCategoryModalForm.reset();
            }, 500);  
        });

    }



    // Public methods
    return {
        init: function() {
            initDatatable();
            handleSearchDatatable();
            initToggleToolbar();
            handleDeleteRows();





			// Elements
			modalEl = document.querySelector('#category-modal-create');

			if (!modalEl) {
				return;
			}

			modal = new bootstrap.Modal(modalEl);
            
			productCategoryModalForm = document.querySelector('#category-modal-create_form');
			productCategoryModalsubmitButton = document.getElementById('category-modal-create_submit');
			productCategoryModalcancelButton = document.getElementById('category-modal-create_cancel');
			dataModelDismiss = document.getElementById('data-model-dismiss');

            

			handleProductCategoryCreateForm();
            handleProductCategoryUpdateRows();
            handleDataModelDismiss();



        }
    }

}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    DatatablesAndCRUDOperationServerSide.init();
});