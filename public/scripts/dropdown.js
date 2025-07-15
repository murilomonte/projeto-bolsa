let userDropdown = document.querySelector('#user-dropdown');
let userDropdownContent = document.querySelector('#user-dropdown-content');

userDropdown.addEventListener('click', () => {
    userDropdownContent.classList.toggle("display-block");
});
