document.addEventListener('DOMContentLoaded', () => {
    const eventRedirectButton = document.getElementById('eventRedirectButton');
    const submitCodeButton = document.getElementById('submitCodeButton');
    const inviteCodeForm = document.getElementById('inviteCodeForm');
    const userNameInput = document.getElementById('userName');
    const invitationCodeInput = document.getElementById('invitationCode');
    const submitErrorMessage = document.getElementById('submitErrorMessage');
    const submissionSuccessMessage = document.getElementById('submissionSuccessMessage');
    const featuredCodeInfo = document.getElementById('featuredCodeInfo');
    const featuredUserNameSpan = document.getElementById('featuredUserName');
    const featuredCodeLink = document.getElementById('featuredCodeLink');
    const mainButtonClickCount = document.getElementById('mainButtonClickCount');

    let hasClickedMainButton = false;

    let clickCount = parseInt(localStorage.getItem('mainButtonClickCount')) || 0;
    mainButtonClickCount.textContent = `Clicks: ${clickCount}`;

    eventRedirectButton.addEventListener('click', () => {
        hasClickedMainButton = true;
        submitCodeButton.disabled = false;
        submitErrorMessage.textContent = '';
        eventRedirectButton.textContent = 'Event Page (Clicked!)';
        eventRedirectButton.style.backgroundColor = '#2ecc71';
        eventRedirectButton.style.cursor = 'default';

        clickCount++;
        localStorage.setItem('mainButtonClickCount', clickCount);
        mainButtonClickCount.textContent = `Clicks: ${clickCount}`;

        window.open('https://webstatic-sea.mihoyo.com/ys/event/e20250618-share/index.html', '_blank');
    });

    inviteCodeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        submitErrorMessage.textContent = '';
        submissionSuccessMessage.textContent = '';

        if (!hasClickedMainButton) {
            submitErrorMessage.textContent = 'Please click "Take Part in Event" button first! 🔒';
            return;
        }

        const userName = userNameInput.value.trim();
        const invitationCode = invitationCodeInput.value.trim();

        if (userName === '' || invitationCode === '') {
            submitErrorMessage.textContent = 'Please enter both your name and invitation code.';
            return;
        }

        if (invitationCode.includes('http://') || invitationCode.includes('https://') || invitationCode.includes('.')) {
            submitErrorMessage.textContent = 'Invalid code format. Please enter only the code, not a link.';
            invitationCodeInput.value = '';
            return;
        }

        const fullInviteLink = `https://hoyo.link/OFeyFZKYs?i_code=${invitationCode}`;

        submissionSuccessMessage.textContent = `Success! Your code (${invitationCode}) has been submitted. Look out for "${userName}" in the featured section! (Note: Manual update for demo)`;
        userNameInput.value = '';
        invitationCodeInput.value = '';
        submitCodeButton.disabled = true;
        hasClickedMainButton = false;

        updateFeaturedCode(userName, fullInviteLink);
    });

    function updateFeaturedCode(name, link) {
        featuredUserNameSpan.textContent = name;
        featuredCodeLink.href = link;
        featuredCodeLink.textContent = link;
    }

    featuredUserNameSpan.textContent = "Helpogem Forge Team";
    featuredCodeLink.href = "https://hoyo.link/OFeyFZKYs?i_code=DEMOCODE";
    featuredCodeLink.textContent = "https://hoyo.link/OFeyFZKYs?i_code=DEMOCODE";

});
