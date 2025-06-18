document.addEventListener('DOMContentLoaded', () => {
    const eventRedirectButton = document.getElementById('eventRedirectButton');
    const submitCodeButton = document.getElementById('submitCodeButton');
    const inviteCodeForm = document.getElementById('inviteCodeForm');
    const userNameInput = document.getElementById('userName');
    const invitationCodeInput = document.getElementById('invitationCode');
    const submitErrorMessage = document.getElementById('submitErrorMessage');
    const submissionSuccessMessage = document.getElementById('submissionSuccessMessage');
    const featuredUserNameSpan = document.getElementById('featuredUserName');
    const featuredCodeLink = document.getElementById('featuredCodeLink');
    const mainButtonClickCount = document.getElementById('mainButtonClickCount');

    let hasClickedMainButton = false;

    let submittedCodes = JSON.parse(localStorage.getItem('submittedCodes')) || [];

    let clickCount = parseInt(localStorage.getItem('mainButtonClickCount')) || 0;
    mainButtonClickCount.textContent = `Clicks: ${clickCount}`;

    // Function to update the featured code section
    function updateFeaturedCode(name, link) {
        featuredUserNameSpan.textContent = name;
        featuredCodeLink.href = link;
        featuredCodeLink.textContent = link;
    }

    // Set the initial featured code to GB77PIFHHN
    // This function must be defined BEFORE it's called
    updateFeaturedCode("Helpogem Forge Team (Initial)", "https://hoyo.link/OFeyFZKYs?i_code=GB77PIFHHN");


    // Event listener for the main redirect button
    eventRedirectButton.addEventListener('click', () => {
        hasClickedMainButton = true;
        submitErrorMessage.textContent = '';
        submissionSuccessMessage.textContent = 'You can now submit your invitation code above! ✅';

        eventRedirectButton.textContent = 'Event Page (Unlocked!)';
        eventRedirectButton.style.backgroundColor = '#2ecc71';
        eventRedirectButton.style.cursor = 'default';

        clickCount++;
        localStorage.setItem('mainButtonClickCount', clickCount);
        mainButtonClickCount.textContent = `Clicks: ${clickCount}`;

        // FIX: Redirect to the currently featured code link
        // Get the href attribute of the featuredCodeLink element
        const redirectToLink = featuredCodeLink.href;
        if (redirectToLink && redirectToLink !== '#') { // Ensure it's a valid link
            window.open(redirectToLink, '_blank');
        } else {
            // Fallback or error message if the featured link isn't set or is invalid
            console.error("Featured link is not valid for redirection.");
            alert("The featured link is not currently available for redirection. Please try again later.");
        }
    });

    // Event listener for invitation code form submission
    inviteCodeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        submitErrorMessage.textContent = '';
        submissionSuccessMessage.textContent = '';

        const userName = userNameInput.value.trim();
        const invitationCode = invitationCodeInput.value.trim().toUpperCase();

        if (userName === '' || invitationCode === '') {
            submitErrorMessage.textContent = 'Please enter both your name and invitation code.';
            return;
        }

        if (invitationCode.includes('http://') || invitationCode.includes('https://') || invitationCode.includes('.')) {
            submitErrorMessage.textContent = 'Invalid code format. Please enter only the code, not a link. (Link rejected)';
            invitationCodeInput.value = '';
            return;
        }

        if (invitationCode.length < 8 || invitationCode.length > 12) {
            submitErrorMessage.textContent = 'Invitation code seems too short or too long. Please check.';
            return;
        }

        if (submittedCodes.includes(invitationCode)) {
            submitErrorMessage.textContent = `You have already submitted this code (${invitationCode})! Please enter a different one.`;
            return;
        }

        if (!hasClickedMainButton) {
            submitErrorMessage.textContent = 'Submission rejected! Please click "Take Part in Event" below first to activate your submission. 🔒';
            return;
        }

        const fullInviteLink = `https://hoyo.link/OFeyFZKYs?i_code=${invitationCode}`;

        submittedCodes.push(invitationCode);
        localStorage.setItem('submittedCodes', JSON.stringify(submittedCodes));

        submissionSuccessMessage.textContent = `Submission success! Your code (${invitationCode}) from ${userName} is now registered. Look out for "${userName}" in the featured section!`;
        
        userNameInput.value = '';
        invitationCodeInput.value = '';
        
        // When a new code is submitted, update the featured code immediately for demonstration.
        // In a real scenario, this would be handled by a backend selecting a random code.
        updateFeaturedCode(userName, fullInviteLink);
    });

    // Moved initial featured code setup to the top to ensure updateFeaturedCode is defined
    // before it's called. This also makes sure the featured link is set before the button
    // is potentially clicked very quickly.
});
