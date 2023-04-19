function setUpdateModalFields(movie) {
    let updateModal = document.getElementById("update-movie-modal");
    let form = updateModal.querySelector("form");

    form.querySelector("input[name='title']").value = movie.title;
    form.querySelector("textarea[name='description']").value = movie.description;
    form.querySelector("input[name='price']").value = movie.price;
    form.querySelector("input[name='image']").value = movie.image;

    updateModal.addEventListener('shown.bs.modal', function () {
      form.querySelector("input[name='title']").focus();
    });
  }

  

  
  