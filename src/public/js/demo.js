$().ready(function() {
    $sidebar = $('.sidebar');
    $sidebar_img_container = $sidebar.find('.sidebar-background');

    $full_page = $('.full-page');

    $sidebar_responsive = $('body > .navbar-collapse');

    window_width = $(window).width();

    fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

    if (window_width > 767 && fixed_plugin_open == 'Dashboard') {
        if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
            $('.fixed-plugin .dropdown').addClass('show');
        }

    }

    $('.fixed-plugin a').click(function(event) {
        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
        if ($(this).hasClass('switch-trigger')) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
        }
    });

    $('.fixed-plugin .background-color span').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var new_color = $(this).data('color');

        if ($sidebar.length != 0) {
            $sidebar.attr('data-color', new_color);
        }

        if ($full_page.length != 0) {
            $full_page.attr('filter-color', new_color);
        }

        if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.attr('data-color', new_color);
        }
    });

    $('.fixed-plugin .img-holder').click(function() {
        $full_page_background = $('.full-page-background');

        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');


        var new_image = $(this).find("img").attr('src');

        if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            $sidebar_img_container.fadeOut('fast', function() {
                $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                $sidebar_img_container.fadeIn('fast');
            });
        }

        if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $full_page_background.fadeOut('fast', function() {
                $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
                $full_page_background.fadeIn('fast');
            });
        }

        if ($('.switch-sidebar-image input:checked').length == 0) {
            var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
            $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
        }

        if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
        }
    });

    $('.switch input').on("switchChange.bootstrapSwitch", function() {

        $full_page_background = $('.full-page-background');

        $input = $(this);

        if ($input.is(':checked')) {
            if ($sidebar_img_container.length != 0) {
                $sidebar_img_container.fadeIn('fast');
                $sidebar.attr('data-image', '#');
            }

            if ($full_page_background.length != 0) {
                $full_page_background.fadeIn('fast');
                $full_page.attr('data-image', '#');
            }

            background_image = true;
        } else {
            if ($sidebar_img_container.length != 0) {
                $sidebar.removeAttr('data-image');
                $sidebar_img_container.fadeOut('fast');
            }

            if ($full_page_background.length != 0) {
                $full_page.removeAttr('data-image', '#');
                $full_page_background.fadeOut('fast');
            }

            background_image = false;
        }
    });
});

type = ['primary', 'info', 'success', 'warning', 'danger'];

demo = {
    initPickColor: function() {
        $('.pick-class-label').click(function() {
            var new_class = $(this).attr('new-class');
            var old_class = $('#display-buttons').attr('data-class');
            var display_div = $('#display-buttons');
            if (display_div.length) {
                var display_buttons = display_div.find('.btn');
                display_buttons.removeClass(old_class);
                display_buttons.addClass(new_class);
                display_div.attr('data-class', new_class);
            }
        });
    },

    initDocumentationCharts: function() {
        /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

        dataDailySalesChart = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                [12, 17, 7, 17, 23, 18, 38]
            ]
        };

        optionsDailySalesChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        // lbd.startAnimationForLineChart(dailySalesChart);
    },

    initDashboardPageCharts: function(percentaje, percentageString, annotationsDates, annotations, users, degreeStudy) {

        var dataPreferences = {
            series: [
                [25, 30, 20, 25]
            ]
        };

        var optionsPreferences = {
            donut: true,
            donutWidth: 40,
            startAngle: 0,
            total: 100,
            showLabel: false,
            axisX: {
                showGrid: false
            }
        };

        Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);

        Chartist.Pie('#chartPreferences', {
            labels: percentageString,
            series: percentaje
        });


        var dataSales = {
            labels: annotationsDates,
            series: [
                annotations
            ]
        };

        // var optionsSales = {
        //   lineSmooth: false,
        //   low: 0,
        //   high: 800,
        //    chartPadding: 0,
        //   showArea: true,
        //   height: "245px",
        //   axisX: {
        //     showGrid: false,
        //   },
        //   axisY: {
        //     showGrid: false,
        //   },
        //   lineSmooth: Chartist.Interpolation.simple({
        //     divisor: 6
        //   }),
        //   showLine: false,
        //   showPoint: true,
        //   fullWidth: true
        // };

        var responsiveSales = [
            ['screen and (max-width: 640px)', {
                axisX: {
                    labelInterpolationFnc: function(value) {
                        return value[0];
                    }
                }
            }]
        ];

        var chartHours = Chartist.Line('#chartHours', dataSales, responsiveSales);

        // lbd.startAnimationForLineChart(chartHours);

        var data = {
            labels: annotationsDates,
            series: [
                users
            ],
        };

        var options = {
            seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: "245px"
        };

        var responsiveOptions = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        return value[0];
                    }
                }
            }]
        ];

        var chartActivity = Chartist.Bar('#chartActivity', data, options, responsiveOptions);

        chartActivity.on('draw', function(context) {
            if(context.type === 'bar') {
                context.element.attr({
                    style: 'stroke:  #FFA534'
                });
            }
        });

        var data = {
            labels: ["Preparatory", "Bachelor's Degree", "Master's Degree", "Doctorate"],
            series: [
                degreeStudy
            ],
        };

        var options = {
            seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: "245px"
        };

        var responsiveOptions = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        return value[0];
                    }
                }
            }]
        ];

        var chartActivity2 = Chartist.Bar('#chartActivity2', data, options, responsiveOptions);

        // lbd.startAnimationForBarChart(chartActivity);

        // /* ----------==========     Daily Sales Chart initialization    ==========---------- */
        //
        // dataDailySalesChart = {
        //     labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        //     series: [
        //         [12, 17, 7, 17, 23, 18, 38]
        //     ]
        // };
        //
        // optionsDailySalesChart = {
        //     lineSmooth: Chartist.Interpolation.cardinal({
        //         tension: 0
        //     }),
        //     low: 0,
        //     high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        //     chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        // }
        //
        // var dailySalesChart = Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        // lbd.startAnimationForLineChart(dailySalesChart);

        //
        //
        // /* ----------==========     Completed Tasks Chart initialization    ==========---------- */
        //
        // dataCompletedTasksChart = {
        //     labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
        //     series: [
        //         [230, 750, 450, 300, 280, 240, 200, 190]
        //     ]
        // };
        //
        // optionsCompletedTasksChart = {
        //     lineSmooth: Chartist.Interpolation.cardinal({
        //         tension: 0
        //     }),
        //     low: 0,
        //     high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        //     chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
        // }
        //
        // var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);
        //
        // // start animation for the Completed Tasks Chart - Line Chart
        // lbd.startAnimationForLineChart(completedTasksChart);
        //
        //
        // /* ----------==========     Emails Subscription Chart initialization    ==========---------- */
        //
        // var dataEmailsSubscriptionChart = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]
        //
        //   ]
        // };
        // var optionsEmailsSubscriptionChart = {
        //     axisX: {
        //         showGrid: false
        //     },
        //     low: 0,
        //     high: 1000,
        //     chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
        // };
        // var responsiveOptions = [
        //   ['screen and (max-width: 640px)', {
        //     seriesBarDistance: 5,
        //     axisX: {
        //       labelInterpolationFnc: function (value) {
        //         return value[0];
        //       }
        //     }
        //   }]
        // ];
        // var emailsSubscriptionChart = Chartist.Bar('#emailsSubscriptionChart', dataEmailsSubscriptionChart, optionsEmailsSubscriptionChart, responsiveOptions);
        //
        // //start animation for the Emails Subscription Chart
        // lbd.startAnimationForBarChart(emailsSubscriptionChart);

    },

    initGoogleMaps: function() {
        var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
        var mapOptions = {
            zoom: 13,
            center: myLatlng,
            scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
            styles: [{
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e9e9e9"
                }, {
                    "lightness": 17
                }]
            }, {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }, {
                    "lightness": 20
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                }, {
                    "lightness": 17
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#ffffff"
                }, {
                    "lightness": 29
                }, {
                    "weight": 0.2
                }]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }, {
                    "lightness": 18
                }]
            }, {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }, {
                    "lightness": 16
                }]
            }, {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }, {
                    "lightness": 21
                }]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dedede"
                }, {
                    "lightness": 21
                }]
            }, {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "color": "#ffffff"
                }, {
                    "lightness": 16
                }]
            }, {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "saturation": 36
                }, {
                    "color": "#333333"
                }, {
                    "lightness": 40
                }]
            }, {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f2f2f2"
                }, {
                    "lightness": 19
                }]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#fefefe"
                }, {
                    "lightness": 20
                }]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#fefefe"
                }, {
                    "lightness": 17
                }, {
                    "weight": 1.2
                }]
            }]
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            title: "Hello World!"
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    },

    showNotificationTestosterone: function(from, align, day, periodDays, testosterone) {

        if (day <= 0) {
            color = 0;

            $.notify({
                icon: "nc-icon nc-bell-55",
                message: "Welcome to <b>4 Lunas</b>."
    
            }, {
                type: type[color],
                timer: 8000,
                placement: {
                    from: from,
                    align: align
                }
            });
        }
        
        if (day <= periodDays) {
            if (day < periodDays) {
                if (day === 1) {
                    color = 2;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "You have not started your testosterone cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } 
                if ((testosterone[0] === 0) && (testosterone[1] === 0) && (testosterone[2] === 0)) {
                    color = 2;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "You have not started your testosterone cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((testosterone[0] === 0) && (testosterone[1] === 0) && (testosterone[2] > 0)) {
                    color = 3;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "Tomorrow he starts his testosterone cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((testosterone[0] === 0) && (testosterone[1] > 0)) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Today he started his testosterone cycle is from ${testosterone[1]}` 
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((testosterone[0] < testosterone[1]) && (testosterone[1] < testosterone[2])) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your testosterone is rising in ${testosterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((testosterone[0] < testosterone[1]) && (testosterone[1] > testosterone[2])) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your testosterone is at its highest in ${testosterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((testosterone[0] > testosterone[1]) && (testosterone[1] > testosterone[2])) {
                    color = 1;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `It's lowering your testosterone in ${testosterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((testosterone[0] > testosterone[1]) && (testosterone[1] < testosterone[2])) {
                    color = 1;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your testosterone is at a minimum ${testosterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                }
            } else if (day === periodDays) {
                color = 2;

                $.notify({
                    icon: "nc-icon nc-bell-55",
                    message: "You have finished your testosterone cycle"
        
                }, {
                    type: type[color],
                    timer: 8000,
                    placement: {
                        from: from,
                        align: align
                    }
                });
            }
        }

        if (day > periodDays) {
            color = 0;

            $.notify({
                icon: "nc-icon nc-bell-55",
                message: "Your service ends in <b>4 Lunas</b>, to use it again, enter your start date of the period"
    
            }, {
                type: type[color],
                timer: 8000,
                placement: {
                    from: from,
                    align: align
                }
            });
        }
    },

    showNotificationEstrogen: function(from, align, day, periodDays, estrogen) {
        
        if (day <= periodDays) {
            if (day < periodDays) {
                if (day === 1) {
                    color = 2;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "You have not started your estrogen cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } 
                if ((estrogen[0] === 0) && (estrogen[1] === 0) && (estrogen[2] === 0)) {
                    color = 2;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "You have not started your estrogen cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((estrogen[0] === 0) && (estrogen[1] === 0) && (estrogen[2] > 0)) {
                    color = 3;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "Tomorrow starts your estrogen cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((estrogen[0] === 0) && (estrogen[1] > 0)) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your estrogen cycle begins today is ${estrogen[1]}` 
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((estrogen[0] < estrogen[1]) && (estrogen[1] < estrogen[2])) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your estrogen is rising in ${estrogen[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((estrogen[0] < estrogen[1]) && (estrogen[1] > estrogen[2])) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your estrogen is at its highest in ${estrogen[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((estrogen[0] > estrogen[1]) && (estrogen[1] > estrogen[2])) {
                    color = 1;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `It's lowering your estrogen in ${estrogen[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((estrogen[0] > estrogen[1]) && (estrogen[1] < estrogen[2])) {
                    color = 1;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your estrogen is at a minimum ${estrogen[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((estrogen[0] > estrogen[1]) && (estrogen[1] === 0) && (estrogen[2] === 0)) {
                    color = 2;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "You have finished your estrogen cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                }
            } else if (day === periodDays) {
                color = 2;

                $.notify({
                    icon: "nc-icon nc-bell-55",
                    message: "You have finished your estrogen cycle"
        
                }, {
                    type: type[color],
                    timer: 8000,
                    placement: {
                        from: from,
                        align: align
                    }
                });
            }
        }
    },

    showNotificationProgesterone: function(from, align, day, periodDays, progesterone) {
        
        if (day <= periodDays) {
            if (day < periodDays) {
                if (day === 1) {
                    color = 2;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "You have not started your progesterone cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } 
                if ((progesterone[0] === 0) && (progesterone[1] === 0) && (progesterone[2] === 0)) {
                    color = 2;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "You have not started your progesterone cycle"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((progesterone[0] === 0) && (progesterone[1] === 0) && (progesterone[2] > 0)) {
                    color = 3;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: "Tomorrow your progesterone cycle starts"
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((progesterone[0] === 0) && (progesterone[1] > 0)) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Today he started his progesterone cycle is ${progesterone[1]}` 
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((progesterone[0] < progesterone[1]) && (progesterone[1] < progesterone[2])) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your progesterone is rising in ${progesterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((progesterone[0] < progesterone[1]) && (progesterone[1] > progesterone[2])) {
                    color = 4;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your progesterone is at its highest in ${progesterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((progesterone[0] > progesterone[1]) && (progesterone[1] > progesterone[2])) {
                    color = 1;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `It's lowering your progesterone in ${progesterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                } else if ((progesterone[0] > progesterone[1]) && (progesterone[1] < progesterone[2])) {
                    color = 1;

                    $.notify({
                        icon: "nc-icon nc-bell-55",
                        message: `Your progesterone is at a minimum in ${progesterone[1]}`
            
                    }, {
                        type: type[color],
                        timer: 8000,
                        placement: {
                            from: from,
                            align: align
                        }
                    });
                }
            } else if (day === periodDays) {
                color = 2;

                $.notify({
                    icon: "nc-icon nc-bell-55",
                    message: "You have finished your progesterone cycle"
        
                }, {
                    type: type[color],
                    timer: 8000,
                    placement: {
                        from: from,
                        align: align
                    }
                });
            }
        }
    },
    
    showNotificationHappy: function(from, align, averageHappyDate) {
        color = 1;

        $.notify({
            icon: "nc-icon nc-bell-55",
            message: `You will be happy in the days ${averageHappyDate.promedio_fecha_feliz}`

        }, {
            type: type[color],
            timer: 8000,
            placement: {
                from: from,
                align: align
            }
        });
    },

    showNotificationSad: function(from, align, averageSadDate) {
        color = 1;

        $.notify({
            icon: "nc-icon nc-bell-55",
            message: `You will be sad in the days ${averageSadDate.promedio_fecha_triste}`

        }, {
            type: type[color],
            timer: 8000,
            placement: {
                from: from,
                align: align
            }
        });
    }

}