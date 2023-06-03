$(function() {

    const $headerMenu = $(".js-menu");
    let isFixed = false;

    $(".js-menu-btn").on("click", function() {
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
            $headerMenu.removeClass("active");
        }else{
            $(this).addClass("active");
            $headerMenu.addClass("active");
        }
    });

    // скролл к элементу
    document.querySelectorAll('.scrollto').forEach(link => {

        link.addEventListener('click', function(e) {
            e.preventDefault();

            $(".js-menu-btn").removeClass("active")
            $headerMenu.removeClass("active");

            let href = this.getAttribute('href');

            const scrollTarget = document.getElementById(href);

            const topOffset = document.querySelector('.header').offsetHeight;
            // const topOffset = 0; // если не нужен отступ сверху
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

/*    function handleScroll() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        if (window.innerWidth >= 768) {
            if (winScroll > 500 && !isFixed) {
                $headerMenu.addClass("header__menu_move");
                isFixed = true
            } else if (winScroll < 500 && isFixed) {
                $headerMenu.removeClass("header__menu_move");
                isFixed = false
            }
        }
    }

    handleScroll();

    document.addEventListener("scroll", handleScroll)*/

})
