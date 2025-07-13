import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Resource } from 'i18next';
// Import in the entry file i18n

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {// Define what needs to be translated and what the type is
            translation: {
                getStart: string;
                UploadPhoto: string;
                Uploaddesc:string;
                AddAddress:string;
                Camera:string;
                Album:string;
                Search:string;
                photoRequirements: {
                    title:  string;
                    noFaces:  string;
                    noObstructions: string;
                    noShadows: string;
                    noDistortion: string;
                    clear:  string;
                    wholeBuilding:  string;
                };
                uploadMessages: {
                    locating: string;
                    mapLoadingFailed: string;
                    locationNotInDarmstadt: string;
                    addressResolutionFailure: string;
                    enterAddress: string;
                    addressNotFound: string;
                    addressSearchFailed: string;
                    noPhotoDetected: string;
                    maxPhotosLimit: string;
                    loginRequired: string;
                    selectLocation: string;
                    enterBuildingAddress: string;
                    uploadAtLeastOnePhoto: string;
                    uploadSuccessful: string;
                    uploadFailed: string;
                    unknownError: string;
                    submitting: string;
                    submit: string;
                    deletePhoto: string;
                    thumbnailImage: string;
                };
                dashboard: {
                    tutorialTitle: string;
                    tutorialDesc: string;
                    uploadTitle: string;
                    uploadDesc: string;
                    buildingPhotoTitle: string;
                    buildingPhotoDesc: string;
                    productIntroductionTitle: string;
                    productIntroDesc: string;
                    uploadHistoryTitle: string;
                    historyDesc:string;
                    photoReviewTitle: string;
                    reviewDesc: string;
                    rankingTitle:string;
                    rankingDesc: string;
                };
                photoReview: {
                    fetch: string;
                    fetching: string;
                    select: string;
                    cancelSelection: string;
                    photo: string;
                    address: string;
                    user: string;
                    time: string;
                    result: string;
                    approve: string;
                    reject: string;
                    noData: string;
                    currentPhotos: string;
                    noPhotos: string;
                    batchApprove: string;
                    batchReject: string;
                    noPhotosPendingReview:string;
                    fetchPhotosFailed:string;
                    singleReviewFailed: string;
                    noPhotosSelectedForReview:string;
                    batchReviewFailed: string;
                    photosFetchedSuccess: string;
                    photoReviewedSuccess: string;
                    photoReviewedRejected: string;
                    batchReviewApprovedSuccess: string;
                    batchReviewRejectedSuccess:string;
                };
                productIntro: {
                    title: string;
                    description: string;
                    participationTitle: string;
                    step1: { title: string; desc: string };
                    step2: { title: string; desc: string };
                    step3: { title: string; desc: string };
                    viewTutorial: string;
                    participateNow: string;
                    viewExample: string;
                };

            };
        };
    }
}

// The target language of each defined component
const resources: Resource = {
    en: {
        translation: {
            getStart: "Get Started",
            dashboard: {
                tutorialTitle: "Tutorial",
                tutorialDesc: "Step-by-step guide",
                uploadTitle: "Upload",
                uploadDesc: "Add your photos here",
                buildingPhotoTitle: "Building Photo Gallery",
                buildingPhotoDesc: "Browse building photos",
                productIntroductionTitle: "Product Introduction",
                productIntroDesc: "Overview of the project",
                uploadHistoryTitle: "Upload History",
                historyDesc: "See your past uploads",
                photoReviewTitle: "Photo Review",
                reviewDesc: "Review uploaded photos",
                rankingTitle: "Rankings",
                rankingDesc: "View user upload contribution ranking"
            },
            UploadPhoto:"Upload Building Photos",
            Uploaddesc:"Please enter the address of the building to be registered (Darmstadt only)",
            AddAddress:"Type the address or click on the map to select.",
            Camera:"Camera",
            Album:"Album",
            Search:"Search",
            photoRequirements: {
                title: "Photo shooting requirements:",
                noFaces: "NO! Face and Licence Plate",
                noObstructions: "NO! Obstructions",
                noShadows: "NO! Shadows on the building",
                noDistortion: "NO! Distortion, ensuring parallelism!",
                clear: "Make sure pictures are clear",
                wholeBuilding: "Photographing the building as a whole"
            },
            uploadMessages: {
                locating: "Locating...",
                mapLoadingFailed: "Map loading failed.",
                locationNotInDarmstadt: "Current location is not in Darmstadt",
                addressResolutionFailure: "Address resolution failure",
                enterAddress: "Please enter the address.",
                addressNotFound: "The address was not found",
                addressSearchFailed: "The address search failed. Please try again later",
                noPhotoDetected: "No photo detected. This may be due to camera permission being denied or the operation being canceled. If this happens repeatedly, please check your phone settings to allow the browser to access the camera or gallery.",
                maxPhotosLimit: "Up to 5 photos can be uploaded.",
                loginRequired: "You must be logged in to upload photos.",
                selectLocation: "Please select the location of the building on the map",
                enterBuildingAddress: "Please enter the building address",
                uploadAtLeastOnePhoto: "Please upload at least one photo",
                uploadSuccessful: "Upload successful! ",
                uploadFailed: "Upload failed: ",
                unknownError: "Unknown error",
                submitting: "submitting...",
                submit: "Submit",
                deletePhoto: "delete photo",
                thumbnailImage: "thumbnail image"
            },
            photoReview: {
                fetch: "Fetch Photos",
                fetching: "Fetching...",
                select: "Select",
                cancelSelection: "Cancel Selection",
                photo: "Photo",
                address: "Building Address",
                user: "Upload User",
                time: "Upload Time",
                result: "Review Result",
                approve: "Approve",
                reject: "Reject",
                noData: "No pending photos for review, click 'Fetch Photos' to get data",
                currentPhotos: "Currently showing {{count}} pending photos for review",
                noPhotos: "No photos loaded",
                batchApprove: "Batch Approve ({{count}})",
                batchReject: "Batch Reject ({{count}})",
                noPhotosPendingReview: "No photos pending review",
                fetchPhotosFailed: "Failed to fetch photos. Please check your network connection or server status.",
                singleReviewFailed: "Review failed. Please try again.",
                noPhotosSelectedForReview: "Please select photos to review first",
                batchReviewFailed: "Batch review failed. Please try again.",
                photosFetchedSuccess: "Successfully fetched {{count}} photos",
                photoReviewedSuccess: "Photo review approved and removed from the list",
                photoReviewedRejected: "Photo review rejected and removed from the list",
                batchReviewApprovedSuccess: "Batch review approved for {{count}} photos",
                batchReviewRejectedSuccess: "Batch review rejected for {{count}} photos",
            },
            productIntro: {
                title: "CityUp",
                description: "CityUP is a student project on innovative urban digitization at Technical University of Darmstadt. It aims to continuously optimize Darmstadt's 3D city digital model through community participation. Your photos will be intelligently matched to corresponding buildings, enhancing the texture details and realism of the current 3D city model. As a reward, you can earn points. We invite citizens to participate in optimizing the city model and become contributors to urban digitization!",
                participationTitle: "Participation Process",
                step1: {
                    title: "Upload building photos",
                    desc: "Photographing the architecture of Darmstadt's city centre"
                },
                step2: {
                    title: "Smart Matching Process",
                    desc: "The system automatically recognises and matches to the corresponding building model."
                },
                step3: {
                    title: "Audit",
                    desc: "After approval, your photo may become part of the official 3D model."
                },
                viewTutorial: "View Tutorial",
                participateNow: "Participate immediately",
                viewExample: "View Example"
            },

        }
    },
    de: {
        translation: {
            getStart: "Loslegen",
            dashboard: {
                tutorialTitle: "Anleitung",
                tutorialDesc: "Schritt-für-Schritt Anleitung",
                uploadTitle: "Hochladen",
                uploadDesc: "Füge hier deine Fotos hinzu",
                buildingPhotoTitle: "Gebäudefotogalerie",
                buildingPhotoDesc: "Durchsuche Gebäudefotos",
                productIntroductionTitle: "Produktvorstellung",
                productIntroDesc: "Projektübersicht",
                uploadHistoryTitle: "Upload-Verlauf",
                historyDesc: "Sieh dir deine bisherigen Uploads an",
                photoReviewTitle: "Fotoüberprüfung",
                reviewDesc: "Hochgeladene Fotos überprüfen",
                rankingTitle: "Rangliste",
                rankingDesc: "Beitragsbasierte Benutzer-Rangliste ansehen"
            },
            UploadPhoto:"Gebäudefotos hochladen",
            Uploaddesc:"Bitte geben Sie die Adresse des anzumeldenden Gebäudes ein (nur Darmstadt)",
            AddAddress:"Geben Sie die Adresse ein oder klicken Sie zur Auswahl auf die Karte.",
            Camera:"Kamera",
            Album:"Album",
            Search:"Suchen",
            photoRequirements: {
                title: "Fotografierichtlinien:",
                noFaces: "KEINE! Gesichter und Kennzeichen",
                noObstructions: "KEINE! Hindernisse",
                noShadows: "KEINE! Schatten auf dem Gebäude",
                noDistortion: "KEINE! Verzerrung, Parallelität sicherstellen!",
                clear: "Stellen Sie sicher, dass die Bilder klar sind",
                wholeBuilding: "Fotografieren Sie das gesamte Gebäude"
            },
            uploadMessages: {
                locating: "Standort wird ermittelt...",
                mapLoadingFailed: "Karte konnte nicht geladen werden.",
                locationNotInDarmstadt: "Aktueller Standort ist nicht in Darmstadt",
                addressResolutionFailure: "Adressauflösung fehlgeschlagen",
                enterAddress: "Bitte geben Sie die Adresse ein.",
                addressNotFound: "Die Adresse wurde nicht gefunden",
                addressSearchFailed: "Die Adresssuche ist fehlgeschlagen. Bitte versuchen Sie es später erneut",
                noPhotoDetected: "Kein Foto erkannt. Dies kann daran liegen, dass die Kameraberechtigung verweigert wurde oder der Vorgang abgebrochen wurde. Wenn dies wiederholt passiert, überprüfen Sie bitte Ihre Telefoneinstellungen, um dem Browser den Zugriff auf die Kamera oder Galerie zu ermöglichen.",
                maxPhotosLimit: "Es können bis zu 5 Fotos hochgeladen werden.",
                loginRequired: "Sie müssen angemeldet sein, um Fotos hochzuladen.",
                selectLocation: "Bitte wählen Sie den Standort des Gebäudes auf der Karte aus",
                enterBuildingAddress: "Bitte geben Sie die Gebäudeadresse ein",
                uploadAtLeastOnePhoto: "Bitte laden Sie mindestens ein Foto hoch",
                uploadSuccessful: "Upload erfolgreich! ",
                uploadFailed: "Upload fehlgeschlagen: ",
                unknownError: "Unbekannter Fehler",
                submitting: "wird übermittelt...",
                submit: "Absenden",
                deletePhoto: "Foto löschen",
                thumbnailImage: "Vorschaubild"
            },
            photoReview: {
                fetch: "Fotos abrufen",
                fetching: "Abrufen...",
                select: "Auswählen",
                cancelSelection: "Auswahl aufheben",
                photo: "Foto",
                address: "Gebäudeadresse",
                user: "Benutzer",
                time: "Hochladezeit",
                result: "Ergebnis",
                approve: "Genehmigen",
                reject: "Ablehnen",
                noData: "Keine Fotos zur Überprüfung. Klicke auf „Fotos abrufen“.",
                currentPhotos: "Zeige derzeit {{count}} Fotos zur Überprüfung",
                noPhotos: "Keine Fotos geladen",
                batchApprove: "Alle genehmigen ({{count}})",
                batchReject: "Alle ablehnen ({{count}})",
                noPhotosPendingReview: "Keine Fotos zur Überprüfung verfügbar",
                fetchPhotosFailed: "Fehler beim Abrufen der Fotos. Bitte überprüfe deine Netzwerkverbindung oder den Serverstatus.",
                singleReviewFailed: "Überprüfung fehlgeschlagen. Bitte versuche es erneut.",
                noPhotosSelectedForReview: "Bitte wähle zuerst Fotos zur Überprüfung aus",
                batchReviewFailed: "Stapelüberprüfung fehlgeschlagen. Bitte versuche es erneut.",
                photosFetchedSuccess: "Erfolgreich {{count}} Fotos abgerufen",
                photoReviewedSuccess: "Fotoüberprüfung genehmigt und von der Liste entfernt",
                photoReviewedRejected: "Fotoüberprüfung abgelehnt und von der Liste entfernt",
                batchReviewApprovedSuccess: "Stapelüberprüfung für {{count}} Fotos genehmigt",
                batchReviewRejectedSuccess: "Stapelüberprüfung für {{count}} Fotos abgelehnt",
            },
            productIntro: {
                title: "CityUp",
                description: "CityUP ist ein studentisches Projekt zur innovativen digitalen Stadtentwicklung an der TU Darmstadt. Ziel ist es, das 3D-Stadtmodell von Darmstadt durch Beteiligung der Bürger kontinuierlich zu verbessern. Ihre Fotos werden intelligent passenden Gebäuden zugeordnet und verbessern die Textur und Realitätstreue des Modells. Als Belohnung können Sie Punkte sammeln. Wir laden Bürger ein, sich zu beteiligen und Teil der digitalen Stadtentwicklung zu werden!",
                participationTitle: "Teilnahmeprozess",
                step1: {
                    title: "Gebäudefotos hochladen",
                    desc: "Fotografieren Sie Gebäude im Stadtzentrum von Darmstadt"
                },
                step2: {
                    title: "Intelligenter Matching-Prozess",
                    desc: "Das System erkennt und ordnet das passende 3D-Modell automatisch zu."
                },
                step3: {
                    title: "Überprüfung",
                    desc: "Nach Freigabe kann Ihr Foto Teil des offiziellen 3D-Modells werden."
                },
                viewTutorial: "Anleitung anzeigen",
                participateNow: "Jetzt mitmachen",
                viewExample: "Beispiel ansehen"
            }

        }
    }
};
// {t('')}


i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language en=English

        // If some translation entry is not available in a certain language
        // ,it will fall back to 'en'
        fallbackLng: 'en',
        interpolation: { //Special symbols will not be garbled
            escapeValue: false
        },
        react: {//When the translation is slow, there will be no loading, but English
            useSuspense: false
        }
    });

export default i18n;