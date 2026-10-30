(function () {
    function updateBrandLink() {
        var brand = document.querySelector('.navbar-brand');
        if (brand) {
            brand.setAttribute('href', 'http://localhost:4200/products');
            brand.onclick = function (e) {
                e.preventDefault();
                window.location.href = 'http://localhost:4200/products';
            };
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateBrandLink);
    } else {
        updateBrandLink();
    }
})();
