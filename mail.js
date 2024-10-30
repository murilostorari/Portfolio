const Btn = document.getElementById("SendButton");
const ContactForm = document.getElementById("contact-form");
const FeedbackMessage = document.getElementById("FeedbackMessage");

ContactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };

    const ServiceID = "service_t9lz88x";
    const TemplateID = "template_j6xw1xb";

    emailjs.send(ServiceID, TemplateID, params).then(() => {
        ContactForm.reset();

        feedbackMessage.textContent = "Email enviado com sucesso!";
        feedbackMessage.className = "success";
        feedbackMessage.classList.remove("hidden");

    }, (err) => {
        feedbackMessage.textContent = "Ocorreu um erro ao enviar o email. Tente novamente.";
        feedbackMessage.className = "error";
        feedbackMessage.classList.remove("hidden");

        console.log(err);
    });

    setTimeout(() => {
        feedbackMessage.classList.add("hidden");
    }, 50000);
});
