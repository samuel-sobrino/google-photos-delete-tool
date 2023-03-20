// How many photos to delete?
// Put a number value, like this
// const maxImageCount = 5896
const maxImageCount = "ALL_PHOTOS";

// Selector for Images and buttons
const ELEMENT_SELECTORS = {
    checkboxClass: '.ckGgle',
    languageAgnosticDeleteButton: 'div[data-delete-origin] button',
	deleteButton: '#yDmH0d > c-wiz > div.u5a4d.QtDoYb.KWdEHf.g7of6e.maPcY > div > div.c9yG5b.txMZRd > div > div:nth-child(3) > span > button',
	// deux fenêtre de confirmation possible au milieu et en-haut
	confirmationButton: '#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.V639qd.OFqiSb.Up8vH.Whe8ub.J9Nfi.iWO5td > div.XfpsVe.J9fJmf > button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.nCP5yc.AjY5Oe.LQeN7.kHssdc.HvOprf',
	confirmationButtonBackup: '#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.V639qd.bvQPzd.oEOLpc.Up8vH.J9Nfi.A9Uzve.iWO5td > div.XfpsVe.J9fJmf > button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.nCP5yc.AjY5Oe.LQeN7.kHssdc.HvOprf'
}

// Time Configuration (in milliseconds)
const TIME_CONFIG = {
    delete_cycle: 10000,
    press_button_delay: 2000
};

const MAX_RETRIES = 10;

let imageCount = 0;

let checkboxes;
let buttons = {
    deleteButton: null,
    confirmationButton: null,
    confirmationButtonBackup: null
}

//debug
console.log("[DEBUG] start");

//boucle
let deleteTask = setInterval(() => {
    let attemptCount = 1;

    do {
        checkboxes = document.querySelectorAll(ELEMENT_SELECTORS['checkboxClass']);

    } while (checkboxes.length <= 0 && attemptCount++ < MAX_RETRIES);

	//debug
	console.log("[DEBUG] checkbox length : "+checkboxes.length);

    if (checkboxes.length <= 0) {
        console.log("[INFO] No more images to delete.");
        clearInterval(deleteTask);
        console.log("[SUCCESS] Tool exited.");
        return;
    }

    imageCount += checkboxes.length;

    checkboxes.forEach((checkbox) => { checkbox.click() });
    console.log("[INFO] Deleting", checkboxes.length, "images");

    setTimeout(() => {
        try {
            buttons.deleteButton = document.querySelector(ELEMENT_SELECTORS['languageAgnosticDeleteButton']);
            buttons.deleteButton.click();
        } catch {
			buttons.deleteButton = document.querySelector(ELEMENT_SELECTORS['deleteButton']);
			buttons.deleteButton.click();
        }

        setTimeout(() => {
			try {
				buttons.confirmation_button = document.querySelector(ELEMENT_SELECTORS['confirmationButton']);
				buttons.confirmation_button.click();
			} catch {
				console.log('[DEBUG] pas de confirmation centrale');
			}
			
			try {
				buttons.confirmationButtonBackup = document.querySelector(ELEMENT_SELECTORS['confirmationButtonBackup']);
				buttons.confirmationButtonBackup.click();
			} catch {
				console.log('[DEBUG] pas de confirmation backup');
			}

            console.log(`[INFO] ${imageCount}/${maxImageCount} Deleted`);
			//si on spécifie un nombre pour maxImageCount on passe dans ce test
            if (maxImageCount !== "ALL_PHOTOS" && imageCount >= parseInt(maxImageCount)) {
                console.log(`${imageCount} photos deleted as requested`);
                clearInterval(deleteTask);
                console.log("[SUCCESS] Tool exited.");
                return;
            }

        }, TIME_CONFIG['press_button_delay']);
    }, TIME_CONFIG['press_button_delay']);
}, TIME_CONFIG['delete_cycle']);
