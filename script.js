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

    // Load submitted codes from local storage to check for duplicates
    // This will store codes submitted by *this user* from *this browser*.
    let submittedCodes = JSON.parse(localStorage.getItem('submittedCodes')) || [];

    // Initialize click count from localStorage
    let clickCount = parseInt(localStorage.getItem('mainButtonClickCount')) || 0;
    mainButtonClickCount.textContent = `Clicks: ${clickCount}`;

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

        // IMPORTANT: Replace '#' with the correct, active event URL when it goes live!
        window.open('#', '_blank');
    });

    // Event listener for invitation code form submission
    inviteCodeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        submitErrorMessage.textContent = '';
        submissionSuccessMessage.textContent = '';

        const userName = userNameInput.value.trim();
        const invitationCode = invitationCodeInput.value.trim().toUpperCase(); // Convert to uppercase for consistent checking

        if (userName === '' || invitationCode === '') {
            submitErrorMessage.textContent = 'Please enter both your name and invitation code.';
            return;
        }

        if (invitationCode.includes('http://') || invitationCode.includes('https://') || invitationCode.includes('.') || invitationCode.length !== 10) { // Added length check for typical Genshin codes
            submitErrorMessage.textContent = 'Invalid code format. Please enter only the 10-character code, not a link. (Link rejected)';
            invitationCodeInput.value = '';
            return;
        }

        // Client-side duplicate check
        if (submittedCodes.includes(invitationCode)) {
            submitErrorMessage.textContent = `You have already submitted this code (${invitationCode})! Please enter a different one.`;
            return;
        }

        if (!hasClickedMainButton) {
            submitErrorMessage.textContent = 'Submission rejected! Please click "Take Part in Event" below first to activate your submission. 🔒';
            return;
        }

        const fullInviteLink = `https://hoyo.link/OFeyFZKYs?i_code=${invitationCode}`;

        // Add the code to the list of submitted codes and save to localStorage
        submittedCodes.push(invitationCode);
        localStorage.setItem('submittedCodes', JSON.stringify(submittedCodes));

        submissionSuccessMessage.textContent = `Submission success! Your code (${invitationCode}) from ${userName} is now registered. Look out for "${userName}" in the featured section!`;
        
        userNameInput.value = '';
        invitationCodeInput.value = '';
        
        // This is a client-side demo update for the featured code.
        // In a real application with a backend, this would fetch the truly randomly selected code.
        updateFeaturedCode(userName, fullInviteLink);
    });

    function updateFeaturedCode(name, link) {
        featuredUserNameSpan.textContent = name;
        featuredCodeLink.href = link;
        featuredCodeLink.textContent = link;
    }

    // Set the initial featured code to GB77PIFHHN
    featuredUserNameSpan.textContent = "Helpogem Forge Team (Initial)";
    featuredCodeLink.href = "https://hoyo.link/OFeyFZKYs?i_code=GB77PIFHHN";
    featuredCodeLink.textContent = "https://hoyo.link/OFeyFZKYs?i_code=GB77PIFHHN";
});
