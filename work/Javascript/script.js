// script.js
// back to top
document.addEventListener('DOMContentLoaded', function() {
    var backToTopButton = document.getElementById("back-to-top");

    window.addEventListener("scroll", scrollFunction);

    function scrollFunction() {
        var scrollTrigger = window.innerHeight * 0.5; // 画面の高さの50%をトリガーにする
        if (document.body.scrollTop > scrollTrigger || document.documentElement.scrollTop > scrollTrigger) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }
    backToTopButton.addEventListener("click", function(){
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

// Copyright
document.addEventListener('DOMContentLoaded', function() {
    const currentYearSpan = document.getElementById('currentYear');
    const startYear = 2024
    const currentYear = new Date().getFullYear();
    
    if (currentYear > startYear) {
        currentYearSpan.textContent = startYear + '-' + currentYear;
    } else {
        currentYearSpan.textContent = currentYear;
    }
});

// Publication list bar
document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const navBar = document.getElementById('navigation-bar');
    const sections = Array.from(document.querySelectorAll('main > section'));
    const titleImage = document.querySelector('.title-image');

    // ナビゲーションバーの生成
    function createNavigation() {
        navBar.innerHTML = '';
        const totalSections = sections.length;
        sections.forEach((section, index) => {
            const navItemContainer = document.createElement('div');
            navItemContainer.classList.add('nav-item-container');

            const navItem = document.createElement('div');
            navItem.classList.add('nav-item');
            navItem.addEventListener('click', () => scrollToSection(section));

            const navLabel = document.createElement('div');
            navLabel.classList.add('nav-label');
            navLabel.textContent = section.id;
            navLabel.dataset.year = section.id;

            navItemContainer.appendChild(navItem);

            // section数が20以上になったら5個に一個生成 TODO
            if (totalSections <= 20 || index === 0 || index === totalSections - 1 || index % 5 === 0) {
                navItemContainer.appendChild(navLabel);
            }

            navBar.appendChild(navItemContainer);
        });
    }

    // セクションへのスクロール
    function scrollToSection(section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }

    // ナビゲーションバーの高さ調整
    function adjustNavBarHeight() {
        const viewportHeight = window.innerHeight;
        const headerHeight = document.querySelector('header').offsetHeight;
        const footerHeight = document.querySelector('footer').offsetHeight;
        const titleImageHeight = titleImage.offsetHeight;
        const availableHeight = viewportHeight - headerHeight - footerHeight - titleImageHeight;
        navBar.style.height = `${availableHeight}px`;
        navBar.style.top = `${headerHeight + titleImageHeight}px`;
    }



    // アクティブなセクションの更新
    function updateActiveSection() {
        const scrollPosition = window.scrollY;
        let activeSection = sections[0];

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop - 200) {
                activeSection = section;
            }
        });

        document.querySelectorAll('.nav-item, .nav-label').forEach(el => el.classList.remove('active'));
        const activeNavItem = navBar.children[sections.indexOf(activeSection)];
        const activeNavLabel = navBar.querySelector(`.nav-label[data-year="${activeSection.id}"]`);
        if (activeNavItem) activeNavItem.classList.add('active');
        if (activeNavLabel) activeNavLabel.classList.add('active');
    }

    function updateScrollbarWidth() {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }

    // 初期化時と画面リサイズ時にスクロールバー幅を更新
    updateScrollbarWidth();
    window.addEventListener('resize', updateScrollbarWidth);

    createNavigation();
    adjustNavBarHeight();
    updateActiveSection();

    window.addEventListener('scroll', updateActiveSection);
    window.addEventListener('resize', adjustNavBarHeight);
});

// 画像の右に文章を書く場合に画面サイズに応じて文字を改行するが、改行が多くなって画像サイズを超えるなら画像も変える
document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    function adjustImageSize() {
        const content = document.querySelector('.content');
        const img = content.querySelector('.content-image');
        const text = content.querySelector('.content-text');
        
        // リセット
        img.style.width = '300px';
        
        // 画像と文章の高さを比較
        if (text.offsetHeight > img.offsetHeight) {
            // 文章が画像より高い場合、画像を縮小
            const ratio = img.offsetHeight / text.offsetHeight;
            img.style.width = `${300 * ratio}px`;
        }
    }

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                    
                    // 画像が読み込まれた後にサイズを調整
                    lazyImage.onload = adjustImageSize;
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Intersection Observerがサポートされていない場合のフォールバック
        let active = false;

        const lazyLoad = function() {
            if (active === false) {
                active = true;

                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.remove("lazy");

                            lazyImage.onload = adjustImageSize;

                            lazyImages = lazyImages.filter(function(image) {
                                return image !== lazyImage;
                            });

                            if (lazyImages.length === 0) {
                                document.removeEventListener("scroll", lazyLoad);
                                window.removeEventListener("resize", lazyLoad);
                                window.removeEventListener("orientationchange", lazyLoad);
                            }
                        }
                    });

                    active = false;
                }, 200);
            }
        };

        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationchange", lazyLoad);
    }

    // 初期化時と画面リサイズ時にも実行
    window.addEventListener('load', adjustImageSize);
    window.addEventListener('resize', adjustImageSize);
});