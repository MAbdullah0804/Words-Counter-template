document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. PUBLIC Q&A DISPLAY (Mock Data)
  ===================================================== */
  const qaData = [
    {
      question: "How long does it take to get a response?",
      answer: "We usually respond within 24 hours on business days.",
      author: "Support Team",
      date: "March 12, 2025"
    },
    // {
    //   question: "Is this FAQ page mobile friendly?",
    //   answer: "Yes, the page is built using Bootstrap 5 and adapts to all screen sizes.",
    //   author: "Web Team",
    //   date: "March 15, 2025"
    // },
    {
      question: "Can I submit my own question?",
      answer: "Yes, you can submit questions using the form below.",
      author: "Admin",
      date: "March 18, 2025"
    }
  ];

  const qaContainer = document.getElementById("qaContainer");

  if (qaContainer) {
    qaData.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 mb-4";

      col.innerHTML = `
        <div class="qa-card">
          <div class="qa-question">Q: ${item.question}</div>
          <div class="qa-answer"><strong>A:</strong> ${item.answer}</div>
          <div class="qa-meta">
            Answered by ${item.author} • ${item.date}
          </div>
        </div>
      `;

      qaContainer.appendChild(col);
    });
  }

  /* =====================================================
     2. ASK A QUESTION FORM (Validation + Submit)
  ===================================================== */
  const questionForm = document.getElementById("questionForm");
  const formMessage = document.getElementById("formMessage");

  if (questionForm) {
    questionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const question = document.getElementById("question").value.trim();

      if (!name || !email || !question) {
        formMessage.innerHTML =
          "<span class='text-danger'>Please fill in all fields.</span>";
        return;
      }

      formMessage.innerHTML =
        "<span class='text-success'>Thank you! Your question has been submitted.</span>";

      this.reset();

      // Hide suggested answer after submission
      if (suggestedAnswerBox) {
        suggestedAnswerBox.classList.add("d-none");
      }
    });
  }

  /* =====================================================
     3. AUTO-SUGGEST ANSWER (DuckDuckGo API)
  ===================================================== */
  const suggestBtn = document.getElementById("suggestBtn");
  const questionInput = document.getElementById("question");
  const suggestedAnswerBox = document.getElementById("suggestedAnswer");
  const answerText = document.getElementById("answerText");

  if (suggestBtn) {
    suggestBtn.addEventListener("click", async () => {
      const question = questionInput.value.trim();

      if (!question) {
        alert("Please enter a question first.");
        return;
      }

      answerText.textContent = "Fetching suggested answer...";
      suggestedAnswerBox.classList.remove("d-none");

      try {
        const response = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(question)}&format=json&no_html=1`
        );

        const data = await response.json();

        if (data.AbstractText) {
          answerText.textContent = data.AbstractText;
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
          answerText.textContent = data.RelatedTopics[0].Text;
        } else {
          answerText.textContent =
            "Your question was sent successfylly by E-mail. Our team will review your question.";
        }
      } catch (error) {
        answerText.textContent =
          "Unable to fetch an answer at the moment. Please try again later.";
      }
    });
  }

});
