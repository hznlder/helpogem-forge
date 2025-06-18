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

    function updateFeaturedCode(name, link) {
        featuredUserNameSpan.textContent = name;
        featuredCodeLink.href = link;
        featuredCodeLink.textContent = link;
    }

    const initialFeaturedLinkURL = "https://hoyo.link/OFeyFZKYs?i_code=GB77PIFHHN";
    updateFeaturedCode("Helpogem Forge Team (Initial)", initialFeaturedLinkURL);

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

        window.open(initialFeaturedLinkURL, '_blank');
    });

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
        
        updateFeaturedCode(userName, fullInviteLink);
    });
});
