document.addEventListener('DOMContentLoaded', function () {
    const brandLink = document.querySelector('.navbar-brand');
    if (brandLink) {
        brandLink.href = 'http://localhost:4200/products';
    }
});
