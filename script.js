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

    // Load submitted codes from local storage for client-side duplicate checking
    let submittedCodes = JSON.parse(localStorage.getItem('submittedCodes')) || [];

    // Initialize and display click count from localStorage
    let clickCount = parseInt(localStorage.getItem('mainButtonClickCount')) || 0;
    mainButtonClickCount.textContent = `Clicks: ${clickCount}`;

    // Function to update the featured code section (used for initial setup and after new submissions)
    function updateFeaturedCode(name, link) {
        featuredUserNameSpan.textContent = name;
        featuredCodeLink.href = link;
        featuredCodeLink.textContent = link;
    }

    // Set the initial featured code when the page loads
    updateFeaturedCode("Helpogem Forge Team (Initial)", "https://hoyo.link/OFeyFZKYs?i_code=GB77PIFHHN");

    // Event listener for the "Take Part in Event" button
    eventRedirectButton.addEventListener('click', () => {
        hasClickedMainButton = true; // Mark that the user has "participated"
        submitErrorMessage.textContent = ''; // Clear any previous error messages
        submissionSuccessMessage.textContent = 'You can now submit your invitation code above! ✅'; // Provide feedback

        // Visual feedback for the button
        eventRedirectButton.textContent = 'Event Page (Unlocked!)';
        eventRedirectButton.style.backgroundColor = '#2ecc71';
        eventRedirectButton.style.cursor = 'default';

        // Increment and save click count
        clickCount++;
        localStorage.setItem('mainButtonClickCount', clickCount);
        mainButtonClickCount.textContent = `Clicks: ${clickCount}`;

        // Get the current featured link and open it in a new tab
        const redirectToLink = featuredCodeLink.href;
        if (redirectToLink && redirectToLink !== '#' && redirectToLink.startsWith('http')) {
            window.open(redirectToLink, '_blank');
        } else {
            console.error("Featured link is not valid for redirection:", redirectToLink);
            alert("The featured link is not currently available for redirection or is invalid. Please try again later.");
        }
    });

    // Event listener for the invitation code form submission
    inviteCodeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission and page reload

        submitErrorMessage.textContent = ''; // Clear previous error
        submissionSuccessMessage.textContent = ''; // Clear previous success

        const userName = userNameInput.value.trim();
        const invitationCode = invitationCodeInput.value.trim().toUpperCase(); // Convert to uppercase for consistent checking

        // Basic validation checks
        if (userName === '' || invitationCode === '') {
            submitErrorMessage.textContent = 'Please enter both your name and invitation code.';
            return;
        }

        if (invitationCode.includes('http://') || invitationCode.includes('https://') || invitationCode.includes('.')) {
            submitErrorMessage.textContent = 'Invalid code format. Please enter only the code, not a link. (Link rejected)';
            invitationCodeInput.value = '';
            return;
        }

        // Basic check for typical Genshin Impact invitation code length
        if (invitationCode.length < 8 || invitationCode.length > 12) {
            submitErrorMessage.textContent = 'Invitation code seems too short or too long. Please check.';
            return;
        }

        // Client-side duplicate check: Prevents the same user from submitting the same code multiple times
        if (submittedCodes.includes(invitationCode)) {
            submitErrorMessage.textContent = `You have already submitted this code (${invitationCode})! Please enter a different one.`;
            return;
        }

        // Check if the "Take Part in Event" button has been clicked to activate submission
        if (!hasClickedMainButton) {
            submitErrorMessage.textContent = 'Submission rejected! Please click "Take Part in Event" below first to activate your submission. 🔒';
            return;
        }

        // Construct the full invite link for saving and displaying
        const fullInviteLink = `https://hoyo.link/OFeyFZKYs?i_code=${invitationCode}`;

        // Add the successfully submitted code to local storage
        submittedCodes.push(invitationCode);
        localStorage.setItem('submittedCodes', JSON.stringify(submittedCodes));

        // Display success message
        submissionSuccessMessage.textContent = `Submission success! Your code (${invitationCode}) from ${userName} is now registered. Look out for "${userName}" in the featured section!`;
        
        // Clear the form fields
        userNameInput.value = '';
        invitationCodeInput.value = '';
        
        // Update the featured code with the newly submitted one for demonstration purposes
        // In a real backend scenario, this would be updated by a system randomly selecting from all submissions.
        updateFeaturedCode(userName, fullInviteLink);
    });
});
