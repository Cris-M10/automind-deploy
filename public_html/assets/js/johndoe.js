// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// protfolio filters
$(window).on("load", function() {
    var t = $(".portfolio-container");
    t.isotope({
        filter: ".new",
        animationOptions: {
            duration: 750,
            easing: "linear",
            queue: !1
        }
    }), $(".filters a").click(function() {
        $(".filters .active").removeClass("active"), $(this).addClass("active");
        var i = $(this).attr("data-filter");
        return t.isotope({
            filter: i,
            animationOptions: {
                duration: 750,
                easing: "linear",
                queue: !1
            }
        }), !1
    });
});


// google maps
function initMap() {
// Styles a map in night mode.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.674, lng: -73.945},
        zoom: 12,
        scrollwheel:  false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    });
}

// Modern Contact Form
$(document).ready(function() {
    // Floating labels - handle autofill
    $('.floating-input').each(function() {
        if ($(this).val()) {
            $(this).addClass('filled');
        }
    });

    $('.floating-input').on('blur', function() {
        if ($(this).val()) {
            $(this).addClass('filled');
        } else {
            $(this).removeClass('filled');
        }
    });

    // Form submission
    $('#modern-contact-form').on('submit', function(e) {
        e.preventDefault();

        var isValid = true;
        var $form = $(this);

        // Reset errors
        $form.find('.floating-input').removeClass('error');

        // Validate required fields
        $form.find('.floating-input[required]').each(function() {
            if (!$(this).val().trim()) {
                $(this).addClass('error');
                isValid = false;
            }
        });

        // Validate email format
        var $email = $('#contact-email');
        if ($email.val().trim()) {
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test($email.val().trim())) {
                $email.addClass('error');
                isValid = false;
            }
        }

        if (!isValid) {
            return;
        }

        // Get form data
        var formData = new FormData();
        formData.append('name', $('#contact-name').val().trim());
        formData.append('email', $('#contact-email').val().trim());
        formData.append('subject', $('#contact-subject').val().trim() || 'Contacto desde M25 AutoMind');
        formData.append('message', $('#contact-message').val().trim());
        formData.append('access_key', 're_Z419NMAs_BJVZQrRpP3wqbGR71oej9sgT');

        // Loading state
        var $btn = $form.find('.btn-submit');
        $btn.addClass('loading');

        // Send to Cloudflare Worker + Resend
        $.ajax({
            url: 'https://automind-contact.cristophermontoyam10.workers.dev',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function() {
                $btn.removeClass('loading');
                $form.find('.form-row, .floating-group, .btn-submit').hide();
                if ($form.find('.form-success').length === 0) {
                    $form.append(
                        '<div class="form-success show">' +
                            '<div class="form-success-icon"><i class="ti-check-box"></i></div>' +
                            '<h3 class="form-success-title">Mensaje enviado</h3>' +
                            '<p class="form-success-text">Gracias por contactarnos. Te responderemos a la brevedad.</p>' +
                        '</div>'
                    );
                } else {
                    $form.find('.form-success').addClass('show');
                }
            },
            error: function() {
                $btn.removeClass('loading');
                alert('Error al enviar. Intenta de nuevo o escríbenos directamente a contacto@automindec.com');
            }
        });
    });

    // Remove error on focus
    $('.floating-input').on('focus', function() {
        $(this).removeClass('error');
    });
});

// ---- Modernization: Scroll-triggered animations ----
$(function() {
    // Navbar active link on scroll
    var sections = $('section, .section, #about, #service, #blog, #contact');
    var navLinks = $('.navbar .nav-link[href^="#"]');

    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop() + 100;
        sections.each(function() {
            var top = $(this).offset().top - 100;
            var bottom = top + $(this).outerHeight();
            var id = $(this).attr('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.removeClass('active');
                $('.navbar .nav-link[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // Scroll-triggered fade-up animations
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                $(entry.target).addClass('visible');
            }
        });
    }, { threshold: 0.15 });

    // Observe about cards
    $('.about-card').each(function() { observer.observe(this); });
    // Observe service cards
    $('#service .card').each(function() { observer.observe(this); });
    // Observe blog cards
    $('.blog-card').each(function() { observer.observe(this); });
    // Observe contact cards
    $('.contact-info-card, .contact-form-card').each(function() { observer.observe(this); });
});
