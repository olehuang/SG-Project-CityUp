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
                mapdesc:string;
                Uploaddesc:string;
                AddAddress:string;
                Camera:string;
                Album:string;
                Search:string;
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
                uploadHistory: {
                    searchPlaceholder:string;
                    searchLabel:string;
                    clear: string;
                    search: string;
                    filterLabel:string;
                    resultPrefix:string;
                    resultSuffix: string;
                    statusPrefix:string;
                    image: string;
                    buildingAddress: string;
                    uploadedAt: string;
                    action:string;
                    imageAlt: string;
                    noImage: string;
                    viewDetails: string;
                    noRecordFound:string;
                    noRecordFoundWithTerm: string;
                    detailDialog: {
                        title: string;
                        photoId:string;
                        location: string;
                        feedback: string;
                        reviewTime:string;
                        closeButton: string;
                        showingSearchResults: string;
                    },
                    statusOptions: {
                        all: string;
                        pending:string;
                        reviewing:string;
                        approved:string;
                        rejected:string;
                    },
                    failedLoadMessage:string;
                };
                ranking:{
                    title:string;
                    userName:string;
                    myRanking:string;
                    myPoint:string;
                    notInRanking: string;
                    myPosition:string;
                    top:string;
                    ranking: string;
                    username: string;
                    points:string;
                    loading:string;
                    getRankingError:string;
                    getUserError:string;
                    unknownError:string;
                };
                photoGallery: {
                    inputBoxLabel: string;
                    searchButton: string;
                    allAddress:string;
                    clearHistory:string;
                    loading:string;
                    error:string;
                    tabelHeader:{
                        address: string;
                        lastUpdateTime: string;
                        photoCount: string;
                    };
                    noMatch:string;
                    photoPreview: {
                        title:string;
                        tipValid: string;
                        tip:string;
                    };
                    viewAllButton:string;
                    alertFetchPhoto:string;
                    errorFetchPhoto:string;
                    photoDetailTitle:string;
                    photoDetails: {
                        uploadTime:string;
                        uploadUser:string;
                        favoriteNr:string;
                    };
                    favoriteButton:string;
                    dislikeButton:string;
                    downloadButton:string;
                    photoViewDialogeTitel:string;
                    photoViewDialogeTitelMobi:string;
                    selectButton:string;
                    cancelButton:string;
                    selectAllButton:string;
                    orderLabel:string;
                    order:{
                        updateTimeAcs:string;
                        updateTimeDecs:string;
                        nameAZ:string;
                        nameZA:string;
                        mostFavorite:string;
                        leastFavorite:string;
                    };
                    errorCollection:{
                        PhotoNumber:string;
                        download:string;
                    };


                };
                bar: {
                    profile: string;
                    userInformation: string;
                    adminPanel: string;
                    dashboard: string;
                    upload: string;
                    tutorial: string;
                    photoGallery: string;
                    uploadHistory: string;
                    productIntroduction: string;
                    photoReview: string;
                    ranking: string;
                    loading: string;
                    exit: string;
                    logOut:string;
                };
                tutorial: {
                    menu: {
                        tutorial: string;
                        photograph: string;
                        photoUpload:string;
                        uploadHistory:string;
                        gallery: string;
                        userInfo: string;
                        faq: string;
                        photoReview:string;
                        photoDownload: string;
                        userManagement:string;
                        rankings:string;
                    };
                    photograph: {
                        title: string;
                        description: string;
                        noShadows: {
                            title: string;
                            description: string;
                        };
                        noObstructions: {
                            title: string;
                            description: string;
                        };
                        straightPerspective: {
                            title: string;
                            description: string;
                        };
                        incorrectExamples: {
                            title: string;
                            tooManyObstructions: string;
                            buildingWithShadow: string;
                            description:string;
                        };
                    };
                    photoUpload: {
                        title: string;
                        description: string;
                        setLocation: {
                            title: string;
                            description: string;
                            browserOptions: {
                                intro: string;
                                allowWhileVisiting: {
                                    title: string;
                                    description: string;
                                };
                                allowThisTime: {
                                    title: string;
                                    description: string;
                                };
                                neverAllow: {
                                    title: string;
                                    description: string;
                                };
                            };
                        };
                        uploadPhotos: {
                            title: string;
                            click:string;
                            shootingUpload: {
                                description: string;
                                buttonText: string;
                            };
                            albumUpload: {
                                description: string;
                                buttonText: string;
                            };
                        };
                        finalizeUpload: {
                            title: string;
                            submit: {
                                description: string;
                                buttonText: string;
                            };
                            remove: {
                                description: string;
                                buttonText: string;
                            };
                            successMessage: string;
                        };
                    };
                    uploadHistory: {
                        title: string;
                        description: string;
                        click:string;
                        steps: {
                            searchAndFilter: {
                                title: string;
                                description: string;
                                searchInstructions: {
                                    enterKeywords: string;
                                    clickSearch: string;
                                    clickClear: string;
                                    desc1:string;
                                    desc2:string;
                                };
                                statusFilter: {
                                    title: string;
                                    pending: {
                                        title: string;
                                        description: string;
                                    };
                                    reviewing: {
                                        title: string;
                                        description: string;
                                    };
                                    approved: {
                                        title: string;
                                        description: string;
                                    };
                                    rejected: {
                                        title: string;
                                        description: string;
                                    };
                                };
                            };
                            viewDetails: {
                                title: string;
                                description: string;
                                closeButton: string;
                                viewDetails:string;
                                desc:string;
                            };
                            pagination: {
                                title: string;
                                description: string;
                                navigation: string;
                            };
                            exitAndReturn: {
                                title: string;
                                description: string;
                            };
                        };
                    };
                    gallery: {
                        title: string;
                        description: string;
                        step1: {
                            title: string;
                            content: string;
                        };
                        step2: {
                            title: string;
                            content1: string;
                            viewAll: string;
                            content2: string;
                        };
                    };
                    userinfo: {
                        title: string;
                        description: string;
                        step1: {
                            title: string;
                            content1: string;
                            profile: string;
                            userinfo: string;
                            content2: string;
                            content3:string;
                        };
                        step2: {
                            title: string;
                            content1: string;
                            save: string;
                            cancel: string;
                            content2: string;
                            content3:string;
                            click:string;
                        };
                    };
                    photoReview: {
                        title: string;
                        description: string;
                        step1: {
                            title:string;
                            desc1:string;
                            fetchPhotos: string;
                            desc2: string;
                            statusApproved:string;
                            and: string;
                            statusRejected:string;
                        },
                        step2: {
                            title: string;
                            desc1: string;
                            accept: string;
                            desc2: string;
                            reject: string;
                            desc3: string;
                            cancel: string;
                        },
                        step3: {
                            title:string;
                            desc1:string;
                            desc2:string;
                            photoReview: string;
                            or: string;
                            exit: string;
                            desc3: string;
                        }
                    };
                    userManagement:{
                        title: string;
                        description: string;
                        step1: {
                            title: string;
                            description: string;
                        };
                        step2: {
                            title: string;
                            description1: string;
                            refresh: string;
                            description2: string;
                        };
                        step3: {
                            title: string;
                            description1: string;
                            delete: string;
                        };
                        step4: {
                            title: string;
                            description1: string;
                            group: string;
                            description2: string;
                            joinGroup: string;
                            reminder: string;
                            description3: string;
                            description4: string;
                            adminGroup: string;
                            description5: string;
                            join: string;
                            description6: string;
                            leave: string;
                            description7: string;
                        };
                    };
                    photoDownload: {
                        title: string;
                        description: string;
                        step1: {
                            title: string;
                            description: string;
                        },
                        step2: {
                            title:string;
                            description1: string;
                            viewAll: string;
                            description2:string;
                        },
                        step3: {
                            title: string;
                            description1: string;
                            download: string;
                            description2: string;
                            description3: string;
                        }
                    };
                    faq: {
                        title:string;
                        photoQuality: {
                            title:string;
                            q1: string;
                            a1: string;
                            q2: string;
                            a2:string;
                        },
                        upload: {
                            title: string;
                            q1: string;
                            a1: string;
                            q2: string;
                            a2: string;
                        },
                        address: {
                            title: string;
                            q1: string;
                            a1: string;
                            q2: string;
                            a2:string;
                        },
                        technical: {
                            title: string;
                            q1: string;
                            a1: string;
                            q2: string;
                            a2: string;
                        }
                    };
                    main: {
                        title: string;
                        welcome: string;
                        quickHelpTitle:string;
                        quickHelpIntro: string;
                        faqLinks: {
                            q1: string;
                            q2: string;
                            q3: string;
                            q4: string;
                            q5: string;
                            q6: string;
                            viewAll: string;
                        }
                    };
                    rankings: {
                        title:string;
                        howToEarn: string;
                        points: {
                            dailyCheckIn: {
                                title: string;
                                description: string;
                            },
                            approvedPhotos: {
                                title:string;
                                description1: string;
                                description2: string;
                            },
                            likes: {
                                title: string;
                                description:string;
                            }
                        },
                        leaderboard: {
                            title: string;
                            displayScope: {
                                title: string;
                                description: string;
                            },
                            pagination: {
                                title:string;
                                description: string;
                            }
                        }
                    };
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
            UploadPhoto:"Upload Building Photos",
            mapdesc:"Drag the marker to adjust the building location",
            Uploaddesc:"Please enter the address of the building to be registered (Darmstadt only)",
            AddAddress:"Type the address or click on the map to select.",
            Camera:"Camera",
            Album:"Album",
            Search:"Search",
            dashboard: {
                tutorialTitle: "Tutorial",
                tutorialDesc: "Step-by-step guide",
                uploadTitle: "Upload",
                uploadDesc: "Add your photos here",
                photoGalleryTitle: "Photo Gallery",
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
            bar:{
                profile: "Profile",
                userInformation: "User Information",
                adminPanel: "Admin Panel",
                dashboard: "Dashboard",
                upload: "Upload",
                tutorial: "Tutorial",
                photoGallery: "Photo Gallery",
                uploadHistory: "Upload History",
                productIntroduction: "Product Introduction",
                photoReview: "Photo Review",
                ranking: "Rankings",
                loading: "Loading...",
                exit: "Exit",
                logOut:"Logout",
            },
            photoRequirements: {
                title: "Photo shooting requirements:",
                noFaces: "Face and Licence Plate",
                pls:"Pls!",
                no:"NO!",
                desc:"Please Prioritize photographing the flesh-colored, khaki, and brown houses on the map.",
                noObstructions: "Obstructions",
                noShadows: "Shadows on the building",
                noDistortion: "Distortion, ensuring parallelism!",
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
            uploadHistory: {
                searchPlaceholder: "Enter search term...",
                searchLabel: "Search by building address",
                clear: "Clear",
                search: "Search",
                filterLabel: "Status",
                resultPrefix: "Found",
                resultSuffix: "result(s)",
                statusPrefix: "with status",
                image: "Image",
                buildingAddress: "Building Address",
                uploadedAt: "Uploaded At",
                action: "Action",
                imageAlt: "Uploaded building photo",
                noImage: "No Image",
                viewDetails: "View Details",
                noRecordFound: "No records found.",
                noRecordFoundWithTerm: 'No records found matching "<strong>{{searchTerm}}</strong>".',
                detailDialog: {
                    title: "Upload Details",
                    photoId: "Photo ID",
                    location: "Location",
                    feedback: "Feedback",
                    reviewTime: "Review Time",
                    closeButton: "Close",
                    showingSearchResults: "Showing all {{count}} search results"
                },
                statusOptions: {
                    all: "All",
                    pending: "Pending",
                    reviewing: "Reviewing",
                    approved: "Approved",
                    rejected: "Rejected"
                },
                failedLoadMessage:"Failed to load upload history. Please try again."
            },
            ranking:{
                title: "User Ranking",
                userName: "User Name",
                myRanking: "My Ranking",
                myPoint: "My Point",
                notInRanking: "Not in Ranking",
                myPosition: "My Position",
                top: "Top",
                ranking: "Ranking",
                username: "Username",
                points: "Points",
                loading: "Loading...",
                getRankingError: "Failed to get ranking",
                getUserError: "Failed to get user info",
                unknownError: "Unknown error",
            },
            photoGallery: {
                inputBoxLabel: "Input Adress",
                searchButton: "Search",
                allAddress:"All Address",
                clearHistory:"Clear History",
                loading:"Loading...",
                error:"Error",
                tabelHeader:{
                    address: "Address",
                    lastUpdateTime: "Last Update Time",
                    photoCount: "Photo Count",
                },
                noMatch:"No Match",
                photoPreview: {
                    title:"Photos Preview",
                    tip:"Please select an address to view photos.",
                    tipValid: "Please enter a valid address to view photos.",
                },
                viewAllButton:"View all",
                alertFetchPhoto:"Error by Fetch Photo, Detail:",
                errorFetchPhoto:"Error loading photos.",
                photoDetailTitle:"Photo Detail",
                photoDetails: {
                    uploadTime:"Upload Time",
                    uploadUser:"Upload User",
                    favoriteNr:"Favorite Number",
                },
                favoriteButton:"Favorite",
                dislikeButton:"Dislike",
                downloadButton:"Download",
                photoViewDialogeTitel:"Photos Under Adresse",
                photoViewDialogeTitelMobi:"Photos",
                selectButton:"Select",
                cancelButton:"Cancel",
                selectAllButton:"Select All",
                orderLabel:"Sort after",
                order:{
                    updateTimeAcs:"Upload Time Ascending",
                    updateTimeDecs:"Upload Time Descending",
                    nameAZ:"Name A-Z",
                    nameZA:"Name Z-A",
                    mostFavorite:"Most favorite",
                    leastFavorite:"Least favorite",
                },
                errorCollection:{
                    PhotoNumber:"muss choose minimal one Photos",
                    download:"Failed to download photo.",
                },
            },
            tutorial: {
                menu: {
                    tutorial: "Tutorial",
                    photograph: "Photograph",
                    photoUpload: "Photo Upload",
                    uploadHistory: "Upload History",
                    gallery: "Building Photo Gallery",
                    userInfo: "User Information",
                    faq: "FAQ",
                    photoReview: "Photo Review",
                    photoDownload: "Photo Download",
                    userManagement: "User Management",
                    rankings:"Rankings"
                },
                photograph: {
                    title: "Photograph",
                    description: "In this section, you will learn how to take proper building photographs. Please follow these essential requirements:",
                    noShadows: {
                        title: "No shadows",
                        description: "Ensure the lighting is even and natural to avoid distortion."
                    },
                    noObstructions: {
                        title: "No obstructions",
                        description: "The building should be fully visible, with no objects (trees, cars, people) blocking it."
                    },
                    straightPerspective: {
                        title: "Straight and aligned perspective",
                        description: "Photos should be taken parallel to the building to maintain accuracy."
                    },
                    incorrectExamples: {
                        title: "Below are some incorrect examples:",
                        tooManyObstructions: "Too many obstructions",
                        buildingWithShadow: "Building with shadow",
                        description:"Heavy shadows distort texture and should be avoided."
                    }
                },
                photoUpload: {
                    title: "Photo Upload",
                    description: "In this section, you will learn how to upload and edit the photos you take, as well as enter the address the photos correspond to. Follow these steps to ensure a smooth upload process:",
                    setLocation: {
                        title: "1. Set your location",
                        description: "You have two location options: 1. allow the website to automatically detect your current location or 2. manually enter an address to position your location.",
                        browserOptions: {
                            intro: "When enabling location access, your browser will offer three options:",
                            allowWhileVisiting: {
                                title: "Allow while visiting the site",
                                description: "lets the site access your location automatically each time you visit."
                            },
                            allowThisTime: {
                                title: "Allow this time",
                                description: "grants location access just once; you'll be prompted again next time."
                            },
                            neverAllow: {
                                title: "Never allow",
                                description: "blocks location access completely. In this case, you'll need to manually enter the location and click 'Search'."
                            }
                        }
                    },
                    uploadPhotos: {
                        title: "2. Upload photos",
                        click:"Click ",
                        shootingUpload: {
                            description: ", navigate to the folder containing the uploaded image, select the image, and click Open. Please note that only PNG and JPG file formats are supported.",
                            buttonText: "Shooting and Upload"
                        },
                        albumUpload: {
                            description: ", if you are uploading multiple photos, the system supports up to 5 images at a time.",
                            buttonText: "Album Upload"
                        }
                    },
                    finalizeUpload: {
                        title: "3. Finalize upload",
                        submit: {
                            description: ", once your photos are selected and the process is complete.",
                            buttonText: "Submit"
                        },
                        remove: {
                            description: ", in the top-right corner of the image to remove it if you're not satisfied with the photo.",
                            buttonText: "red X icon"
                        },
                        successMessage: "You will be prompted when the photo is uploaded successfully."
                    }
                },
                uploadHistory: {
                    title: "Upload History",
                    description: "In this section, you'll learn how to search, filter, and navigate your photo upload history.",
                    click:"Click",
                    steps: {
                        searchAndFilter: {
                            title: "1. Search and filter photos",
                            description: "Use the address search to find uploaded photos, or apply the status filter to view photos based on their current state.",
                            searchInstructions: {
                                enterKeywords: "Enter keywords and click",
                                clickSearch: "Search",
                                clickClear: "Clear",
                                desc1:" ; the results will appear below the search box.",
                                desc2:" to clear the search content."
                            },
                            statusFilter: {
                                title: "Status filter includes four options:",
                                pending: {
                                    title: "Pending",
                                    description: "The photo is waiting for review."
                                },
                                reviewing: {
                                    title: "Reviewing",
                                    description: "The administrator is currently checking the photo."
                                },
                                approved: {
                                    title: "Approved",
                                    description: "The photo has passed the review."
                                },
                                rejected: {
                                    title: "Rejected",
                                    description: "The photo did not pass the review. This may be due to not meeting photo requirements. Please refer to the \"Photograph\" section and re-upload the image after making corrections."
                                }
                            }
                        },
                        viewDetails: {
                            title: "2. View details",
                            description: "to access full information about a photo.",
                            closeButton: "CLOSE",
                            viewDetails:" 'View Details' ",
                            desc:"back to previous step."
                        },
                        pagination: {
                            title: "3. Navigate pagination",
                            description: "This page supports pagination. Photos are sorted from newest to oldest, with the most recently uploaded photos displayed at the top.",
                            navigation: "<, > is for previous/next page, |<, >| is for first/last page."
                        },
                        exitAndReturn: {
                            title: "4. Exit and return",
                            description: "To leave this section, use the sidebar menu on the left or click 'Return to Main Menu'."
                        }
                    }
                },
                gallery: {
                    title: "Photo Gallery",
                    description: "In this section, you will learn how to search for building-related photo uploads and view images easily.",
                    step1: {
                        title: "1. Search by address",
                        content: "Enter an address in the search bar to view the latest upload times and the number of photos related to that location.",
                    },
                    step2: {
                        title: "2. View Photos",
                        content1: "Click on a photo with address from the right panel and click ",
                        viewAll: "'view all'",
                        content2: "to use filter options to sort the photo gallery.",
                    }
                },
                userinfo: {
                    title: "User Information",
                    description: "In this section, you will learn how to manage your own registration information.",
                    step1: {
                        title: "1. Open the User Information page",
                        content1: "From the side menu, click ",
                        profile: "Profile",
                        userinfo: " User Information",
                        content2: "to enter the user information management interface.",
                        content3:"in the dropdown, then select"
                    },
                    step2: {
                        title: "2. Edit your personal details",
                        content1: "On this page, you can update your personal information, such as a valid email address, last name, and first name. Click ",
                        save: " Save",
                        cancel: " Cancel",
                        content2: "to discard them.",
                        content3:"to save changes, or",
                        click:"Click"
                    }
                },
                photoReview: {
                    title: "Photo Review",
                    description: "In this admin section, you can review and approve photos submitted by users.",
                    step1: {
                        title: "1. Fetch user-uploaded photos",
                        desc1: "Click ",
                        fetchPhotos: "'Fetch Photos'",
                        desc2: " to load the images submitted by users for review. You will see photos marked with status ",
                        statusApproved: "'approved'",
                        and: "and",
                        statusRejected: "'rejected'"
                    },
                    step2: {
                        title: "2. Approve or reject photos",
                        desc1: "Use the selection buttons to approve a single photo or multiple photos at once.",
                        accept: "Accept",
                        desc2: " means the photo meets requirements and has the correct address information. If the photo does not meet upload guidelines or does not match the address details, click ",
                        reject: "'Reject'",
                        desc3: "If you want to withdraw the operation, you can click ",
                        cancel: "‘Cancel’"
                    },
                    step3: {
                        title: "3. Final check",
                        desc1: "Review how many photos are still pending. The review date should not exceed three working days.",
                        desc2: "Click ",
                        photoReview: "Photo Review",
                        or: "or",
                        exit: "Exit",
                        desc3: " to return to the main menu."
                    }
                },
                userManagement: {
                    title: "User Management",
                    description: "In this admin section, you can manage user accounts and permissions.",
                    step1: {
                        title: "1. Access User Management Panel",
                        description: "From the homepage, click the left menu and select Admin Panel to access the Keycloak interface.",
                    },
                    step2: {
                        title: "2. Find Users",
                        description1: "Click",
                        refresh: " Refresh",
                        description2: "first to retrieve the latest user list. You can then search users by name or email.",
                    },
                    step3: {
                        title: "3. Delete Users",
                        description1: "To delete a user, click the three dots at the end of the row and select",
                        delete: " Delete",
                    },
                    step4: {
                        title: "4. Add User as Admin",
                        description1: "Select the user's email, click",
                        group: " Group ",
                        description2: "and choose",
                        joinGroup: " Join Group",
                        reminder: "Make sure not to remove the user from the User group.",
                        description3: "Next, click",
                        description4: "to open groups, select the",
                        adminGroup: " admin ",
                        description5: "group and click",
                        join: " Join",
                        description6: "After joining, you can remove users from the admin group if needed by clicking",
                        leave: " Leave",
                        description7: ", then confirm. A success message will appear once the removal is complete.",
                    }
                },
                photoDownload: {
                    title: "Building Photo Gallery",
                    description: "In this section, you will learn how to search for building-related photo uploads and download images easily.",
                    step1: {
                        title: "1. Search by address",
                        description: "Enter an address in the search bar to view the latest upload times and the number of photos related to that location."
                    },
                    step2: {
                        title: "2. View Photos",
                        description1: "Click on a photo with address from the right panel or click ",
                        viewAll: "'view all'",
                        description2: "to use filter options to sort the photo gallery."
                    },
                    step3: {
                        title: "3. Download photos",
                        description1: "Click on a photo from the right panel and then click ",
                        download: "'Download'",
                        description2: "to save it.",
                        description3: "Multiple photos will be downloaded as a ZIP file, while single images will be saved in their original format."
                    }
                },
                faq: {
                    title: "Frequently Asked Questions",
                    photoQuality: {
                        title: "Photo Quality Issues",
                        q1: "Q: Why are my photos being rejected?",
                        a1: "A: Photos may be rejected due to shadows, obstructions, poor lighting, or incorrect perspective.",
                        q2: "Q: What about unavoidable obstructions?",
                        a2: "A: Try different angles or note the obstruction in your submission."
                    },
                    upload: {
                        title: "Upload Issues",
                        q1: "Q: Upload is failing. What to do?",
                        a1: "A: Check internet connection and ensure file size is under 10MB. Supported: JPG, PNG.",
                        q2: "Q: How long for approval?",
                        a2: "A: 1-3 business days. Check status in Upload History."
                    },
                    address: {
                        title: "Address Issues",
                        q1: "Q: Can't find correct address?",
                        a1: "A: Use the auto location function of the upload page. Submit request to add missing addresses.",
                        q2: "Q: Multiple buildings at once?",
                        a2: "A: Yes, but each photo needs its specific building address."
                    },
                    technical: {
                        title: "Technical Issues",
                        q1: "Q: App running slowly?",
                        a1: "A: Clear browser cache, check internet connection, use latest Chrome or Safari.",
                        q2: "Q: Login troubles?",
                        a2: "A: Check credentials or contact administrator for password reset."
                    }
                },
                main: {
                    title: "CityUp Tutorial",
                    welcome: "Welcome to the CityUp tutorial. Select a topic on the left to get started.",
                    quickHelpTitle: "Quick Help - Common Questions",
                    quickHelpIntro: "Click on any question below to jump directly to the answer:",
                    faqLinks: {
                        q1: "Why are my photos being rejected?",
                        q2: "My photo upload is failing. What should I do?",
                        q3: "How long does it take for photos to be approved?",
                        q4: "I can't find the correct address for my building",
                        q5: "The application is running slowly",
                        q6: "I'm having trouble logging in",
                        viewAll: "→ View All FAQ"
                    }
                },
                rankings: {
                    title: "Rankings",
                    howToEarn: "📈 How to earn points:",
                    points: {
                        dailyCheckIn: {
                            title: "1. Daily check-in via photo upload",
                            description: "You get 1 point for uploading a photo each day. If you upload photos for 7 consecutive days or more, you can earn up to 7 extra points."
                        },
                        approvedPhotos: {
                            title: "2. Approved photos",
                            description1: "Each approved photo earns you 5 points. If 5 consecutive uploaded photos are approved, you receive an extra 5 bonus points.",
                            description2: "Example: Based on the upload sequence of photos 1 to 6, if the 3rd photo is not approved while the others are, you don’t get the extra 5 bonus points. In this case, bonus eligibility resets from photo 4 onwards. If photos 7 and 8 are approved, you can earn 5 extra bonus points starting from photo 4."
                        },
                        likes: {
                            title: "3. Likes from other users",
                            description: "Each like from other users gives you 1 point. If the like is withdrawn, the point is invalid. Likes given to your own photo won’t count, and you can only like each photo once."
                        }
                    },
                    leaderboard: {
                        title: "📊 About the leaderboard:",
                        displayScope: {
                            title: "1. Display scope",
                            description: "Only the top 50 users by total points will be shown. If a user has 0 points, they won’t appear on the leaderboard."
                        },
                        pagination: {
                            title: "2. Pagination",
                            description: "If your ranking is not on the first page, use the page navigation to jump to your position, or return to the first page via the button."
                        }
                    }
                }
            }
        }
    },
    de: {
        translation: {
            getStart: "Loslegen",
            UploadPhoto:"Gebäudefotos hochladen",
            Uploaddesc:"Bitte geben Sie die Adresse des anzumeldenden Gebäudes ein (nur Darmstadt)",
            mapdesc:"Ziehen Sie die Markierung, um den Gebäudestandort anzupassen",
            AddAddress:"Geben Sie die Adresse ein oder klicken Sie zur Auswahl auf die Karte.",
            Camera:"Kamera",
            Album:"Album",
            Search:"Suchen",
            dashboard: {
                tutorialTitle: "Anleitung",
                tutorialDesc: "Schritt-für-Schritt Anleitung",
                uploadTitle: "Hochladen",
                uploadDesc: "Füge hier deine Fotos hinzu",
                photoGalleryTitle: "Fotogalerie",
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
            bar:{
                profile: "Profil",
                userInformation: "Benutzerinformation",
                adminPanel: "Admin-Panel",
                dashboard: "Dashboard",
                upload: "Hochladen",
                tutorial: "Anleitung",
                photoGallery: "Fotogalerie",
                uploadHistory: "Upload-Verlauf",
                productIntroduction: "Produktvorstellung",
                photoReview: "Fotoüberprüfung",
                ranking: "Rangliste",
                loading: "Lädt...",
                exit: "Verlassen",
                logOut:"Ausloggen",
            },
            photoRequirements: {
                title: "Fotografierichtlinien:",
                noFaces: "Gesichter und Kennzeichen",
                pls:"Bitte!",
                no:"Nicht!",
                desc:"Bitte fotografieren Sie vorrangig die hautfarbenen, khakifarbenen und braunen Häuser auf der Karte.",
                noObstructions: "Hindernisse",
                noShadows: "Schatten auf dem Gebäude",
                noDistortion: "Verzerrung, Parallelität sicherstellen!",
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
            },
            uploadHistory: {
                searchPlaceholder: "Suchbegriff eingeben...",
                searchLabel: "Nach Gebäudeadresse suchen",
                clear: "Löschen",
                search: "Suchen",
                filterLabel: "Status",
                resultPrefix: "Gefunden",
                resultSuffix: "Ergebnis(se)",
                statusPrefix: "mit Status",
                image: "Bild",
                buildingAddress: "Gebäudeadresse",
                status: "Status",
                uploadedAt: "Hochgeladen am",
                action: "Aktion",
                imageAlt: "Hochgeladenes Gebäudefoto",
                noImage: "Kein Bild",
                viewDetails: "Details ansehen",
                noRecordFound: "Keine Einträge gefunden.",
                noRecordFoundWithTerm: 'Keine Einträge gefunden, die "<strong>{{searchTerm}}</strong>" entsprechen.',
                detailDialog: {
                    title: "Upload-Details",
                    photoId: "Foto-ID",
                    location: "Standort",
                    feedback: "Feedback",
                    reviewTime: "Überprüfungszeit",
                    closeButton: "Schließen",
                    showingSearchResults: "Es werden alle {{count}} Suchergebnisse angezeigt"
                },
                statusOptions: {
                    all: "Alle",
                    pending: "Ausstehend",
                    reviewing: "In Prüfung",
                    approved: "Genehmigt",
                    rejected: "Abgelehnt"
                },
                failedLoadMessage:"Der Upload-Verlauf konnte nicht geladen werden. Bitte versuchen Sie es erneut."
            },
            ranking:{
                title: "Benutzerrangliste",
                userName: "Benutzername",
                myRanking: "Mein Rang",
                myPoint: "Meine Punkte",
                notInRanking: "Nicht in der Rangliste",
                myPosition: "Meine Position",
                top: "OBEN",
                ranking: "Rang",
                username: "Benutzername",
                points: "Punkte",
                loading: "Wird geladen...",
                getRankingError: "Fehler beim Abrufen der Rangliste",
                getUserError: "Fehler beim Abrufen des Benutzers",
                unknownError: "Unbekannter Fehler",
            },
            photoGallery: {
                inputBoxLabel: "Adresse Eingeben",
                searchButton: "Suchen",
                allAddress:"Alle Adressen",
                clearHistory:"Verlauf löschen",
                loading:"Laden...",
                error:"Fehler",

                tabelHeader:{
                    address: "Adresse",
                    lastUpdateTime:"Letzte Aktualisierungszeit",
                    photoCount: "Anzahl der Fotos",
                },
                noMatch:"Keine Übereinstimmung",
                photoPreview: {
                    title: "Fotovorschau",
                    tip:"Bitte wählen Sie eine Adresse aus, um Fotos anzuzeigen.",
                    tipValid: "Bitte geben Sie eine gültige Adresse ein, um Fotos anzuzeigen.",
                },
                viewAllButton:"Alle anzeigen",
                alertFetchPhoto:"Fehler beim Abrufen von Fotos, Detail:",
                errorFetchPhoto:"Fehler beim Laden der Fotos.",
                photoDetailTitle:"Fotodetail",
                photoDetails: {
                    uploadTime:"Upload-Zeit",
                    uploadUser:"Upload-Benutzer",
                    favoriteNr:"Favoritennummer",
                },
                favoriteButton:"Gefällt mir",
                dislikeButton:"Gefällt mir nicht",
                downloadButton:"Herunterladen",
                photoViewDialogeTitel:"Fotos unter Adresse",
                photoViewDialogeTitelMobi:"Fotos",
                selectButton:"Auswählen",
                cancelButton:"Abbrechen",
                selectAllButton:"Alle auswählen",
                orderLabel:"Sortieren nach",
                order:{
                    updateTimeAcs:"Uploadzeit aufsteigend",
                    updateTimeDecs:"Uploadzeit absteigend",
                    nameAZ:"Name A–Z",
                    nameZA:"Name Z–A",
                    mostFavorite:"Beliebteste",
                    leastFavorite:"Unbeliebteste",
                },
                errorCollection:{
                    PhotoNumber:"muss minimal ein Foto auswählen",
                    download:"Herunterladen des Fotos fehlgeschlagen.",
                },
            },
            tutorial: {
                menu: {
                    tutorial: "Anleitung",
                    photograph: "Fotografieren",
                    photoUpload: "Foto-Upload",
                    uploadHistory: "Upload-Verlauf",
                    gallery: "Gebäudefoto-Galerie",
                    userInfo: "Benutzerinformationen",
                    faq: "FAQ",
                    photoReview: "Foto-Überprüfung",
                    photoDownload: "Foto-Download",
                    userManagement: "Benutzerverwaltung",
                    rankings:"Rangliste"
                },
                photograph: {
                    title: "Fotografie",
                    description: "In diesem Abschnitt lernen Sie, wie Sie ordnungsgemäße Gebäudefotos aufnehmen. Bitte befolgen Sie diese wesentlichen Anforderungen:",
                    noShadows: {
                        title: "Keine Schatten",
                        description: "Stellen Sie sicher, dass die Beleuchtung gleichmäßig und natürlich ist, um Verzerrungen zu vermeiden."
                    },
                    noObstructions: {
                        title: "Keine Hindernisse",
                        description: "Das Gebäude sollte vollständig sichtbar sein, ohne dass Objekte (Bäume, Autos, Personen) es verdecken."
                    },
                    straightPerspective: {
                        title: "Gerade und ausgerichtete Perspektive",
                        description: "Fotos sollten parallel zum Gebäude aufgenommen werden, um die Genauigkeit zu gewährleisten."
                    },
                    incorrectExamples: {
                        title: "Hier sind einige falsche Beispiele:",
                        tooManyObstructions: "Zu viele Hindernisse",
                        buildingWithShadow: "Gebäude mit Schatten",
                        description:"Starke Schatten verzerren die Textur und sollten vermieden werden."
                    }
                },
                photoUpload: {
                    title: "Foto-Upload",
                    description: "In diesem Abschnitt lernen Sie, wie Sie Ihre aufgenommenen Fotos hochladen und bearbeiten und die entsprechende Adresse eingeben. Befolgen Sie diese Schritte für einen reibungslosen Upload-Prozess:",
                    setLocation: {
                        title: "1. Standort festlegen",
                        description: "Sie haben zwei Standort-Optionen: 1. der Website erlauben, Ihren aktuellen Standort automatisch zu erkennen oder 2. manuell eine Adresse eingeben, um Ihren Standort zu positionieren.",
                        browserOptions: {
                            intro: "Bei der Aktivierung des Standortzugriffs bietet Ihr Browser drei Optionen:",
                            allowWhileVisiting: {
                                title: "Beim Besuch der Website erlauben",
                                description: "ermöglicht der Website, bei jedem Besuch automatisch auf Ihren Standort zuzugreifen."
                            },
                            allowThisTime: {
                                title: "Dieses Mal erlauben",
                                description: "gewährt einmalig Standortzugriff; Sie werden beim nächsten Mal erneut gefragt."
                            },
                            neverAllow: {
                                title: "Niemals erlauben",
                                description: "blockiert den Standortzugriff vollständig. In diesem Fall müssen Sie den Standort manuell eingeben und 'Suchen' klicken."
                            }
                        }
                    },
                    uploadPhotos: {
                        title: "2. Fotos hochladen",
                        click:"Klicken ",
                        shootingUpload: {
                            description: ", navigieren Sie zum Ordner mit dem hochgeladenen Bild, wählen Sie das Bild aus und klicken Sie auf Öffnen. Bitte beachten Sie, dass nur PNG- und JPG-Dateiformate unterstützt werden.",
                            buttonText: "Aufnahme und Upload"
                        },
                        albumUpload: {
                            description: ", wenn Sie mehrere Fotos hochladen, unterstützt das System bis zu 5 Bilder gleichzeitig.",
                            buttonText: "Album-Upload"
                        }
                    },
                    finalizeUpload: {
                        title: "3. Upload abschließen",
                        submit: {
                            description: ", sobald Ihre Fotos ausgewählt sind und der Prozess abgeschlossen ist.",
                            buttonText: "Absenden"
                        },
                        remove: {
                            description: ", in der oberen rechten Ecke des Bildes, um es zu entfernen, wenn Sie mit dem Foto nicht zufrieden sind.",
                            buttonText: "rotes X-Symbol"
                        },
                        successMessage: "Sie werden benachrichtigt, wenn das Foto erfolgreich hochgeladen wurde."
                    }
                },
                uploadHistory: {
                    title: "Upload-Verlauf",
                    description: "In diesem Abschnitt lernen Sie, wie Sie Ihren Foto-Upload-Verlauf durchsuchen, filtern und navigieren.",
                    click:"Klicken Sie auf",
                    steps: {
                        searchAndFilter: {
                            title: "1. Fotos suchen und filtern",
                            description: "Verwenden Sie die Adresssuche, um hochgeladene Fotos zu finden, oder wenden Sie den Statusfilter an, um Fotos basierend auf ihrem aktuellen Zustand anzuzeigen.",
                            searchInstructions: {
                                enterKeywords: "Geben Sie Schlüsselwörter ein und klicken Sie auf",
                                clickSearch: "Suchen",
                                clickClear: "Löschen",
                                desc1:" ; Die Ergebnisse werden unter dem Suchfeld angezeigt.",
                                desc2:" ,um den Suchinhalt zu löschen."
                            },
                            statusFilter: {
                                title: "Der Statusfilter umfasst vier Optionen:",
                                pending: {
                                    title: "Ausstehend",
                                    description: "Das Foto wartet auf Überprüfung."
                                },
                                reviewing: {
                                    title: "Wird überprüft",
                                    description: "Der Administrator überprüft derzeit das Foto."
                                },
                                approved: {
                                    title: "Genehmigt",
                                    description: "Das Foto hat die Überprüfung bestanden."
                                },
                                rejected: {
                                    title: "Abgelehnt",
                                    description: "Das Foto hat die Überprüfung nicht bestanden. Dies kann daran liegen, dass es die Fotoanforderungen nicht erfüllt. Bitte lesen Sie den Abschnitt \"Fotografie\" und laden Sie das Bild nach Korrekturen erneut hoch."
                                }
                            }
                        },
                        viewDetails: {
                            title: "2. Details anzeigen",
                            description: "um vollständige Informationen über ein Foto zu erhalten.",
                            closeButton: "SCHLIESSEN",
                            viewDetails:" 'Details anzeigen' ",
                            desc:" , um zum vorherigen Schritt zurückzukehren."
                        },
                        pagination: {
                            title: "3. Seitennavigation",
                            description: "Diese Seite unterstützt die Paginierung. Fotos sind vom neuesten zum ältesten sortiert, wobei die zuletzt hochgeladenen Fotos oben angezeigt werden.",
                            navigation: "<, > ist für vorherige/nächste Seite, |<, >| ist für erste/letzte Seite."
                        },
                        exitAndReturn: {
                            title: "4. Zurückkehren",
                            description: "Um diesen Abschnitt zu verlassen, verwenden Sie das Seitenmenü links oder klicken Sie auf 'Zurück zum Hauptmenü'."
                        }
                    }
                },
                gallery: {
                    title: "Fotogalerie",
                    description: "In diesem Abschnitt erfahren Sie, wie Sie Gebäude-bezogene Foto-Uploads suchen und einfach anzeigen können.",
                    step1: {
                        title: "1. Suche nach Adresse",
                        content: "Geben Sie eine Adresse in die Suchleiste ein, um die neuesten Upload-Zeiten und die Anzahl der Fotos für diesen Ort anzuzeigen.",
                    },
                    step2: {
                        title: "2. Fotos anzeigen",
                        content1: "Klicken Sie auf ein Foto mit Adresse aus dem rechten Bereich und dann auf ",
                        viewAll: "'Alle anzeigen'",
                        content2: ", um Filteroptionen zur Sortierung der Galerie zu nutzen.",
                    }
                },
                userinfo: {
                    title: "Benutzerinformationen",
                    description: "In diesem Abschnitt erfahren Sie, wie Sie Ihre Registrierungsinformationen verwalten.",
                    step1: {
                        title: "1. Benutzerinformationsseite öffnen",
                        content1: "Klicken Sie im Seitenmenü auf ",
                        profile: "Profil",
                        userinfo: " Benutzerinformationen",
                        content2: ", um die Benutzerverwaltungsoberfläche zu öffnen.",
                        content3:"in der Dropdown-Liste, und wählen Sie dann"
                    },
                    step2: {
                        title: "2. Persönliche Daten bearbeiten",
                        content1: "Auf dieser Seite können Sie Ihre persönlichen Daten aktualisieren, z. B. eine gültige E-Mail-Adresse, Nachname und Vorname. Klicken Sie auf ",
                        save: " Speichern",
                        cancel: " Abbrechen",
                        content2: ", um die Änderungen zu verwerfen.",
                        content3:"um Änderungen zu speichern, oder",
                        click:"Klicken Sie auf"
                    }
                },
                photoReview: {
                    title: "Fotoüberprüfung",
                    description: "In diesem Admin-Bereich können Sie von Nutzern eingereichte Fotos überprüfen und freigeben.",
                    step1: {
                        title: "1. Nutzerfotos abrufen",
                        desc1: "Klicken Sie auf ",
                        fetchPhotos: "'Fotos abrufen'",
                        desc2: ", um die von Nutzern zur Überprüfung eingereichten Bilder zu laden. Sie sehen Fotos mit dem Status ",
                        statusApproved: "'genehmigt'",
                        and: "und",
                        statusRejected: "'abgelehnt'"
                    },
                    step2: {
                        title: "2. Fotos genehmigen oder ablehnen",
                        desc1: "Verwenden Sie die Auswahlbuttons, um ein einzelnes Foto oder mehrere Fotos gleichzeitig zu genehmigen.",
                        accept: "Genehmigen",
                        desc2: " bedeutet, dass das Foto den Anforderungen entspricht und korrekte Adressinformationen enthält. Wenn das Foto nicht den Upload-Richtlinien entspricht oder nicht zur Adresse passt, klicken Sie auf ",
                        reject: "'Ablehnen'",
                        desc3: "Wenn Sie die Aktion zurücknehmen möchten, klicken Sie auf ",
                        cancel: "'Abbrechen'"
                    },
                    step3: {
                        title: "3. Letzte Überprüfung",
                        desc1: "Überprüfen Sie, wie viele Fotos noch ausstehen. Das Überprüfungsdatum sollte drei Werktage nicht überschreiten.",
                        desc2: "Klicken Sie auf ",
                        photoReview: "Fotoüberprüfung",
                        or: "oder",
                        exit: "Verlassen",
                        desc3: ", um zum Hauptmenü zurückzukehren."
                    }
                },
                userManagement: {
                    title: "Benutzerverwaltung",
                    description: "In diesem Admin-Bereich können Sie Benutzerkonten und Berechtigungen verwalten.",
                    step1: {
                        title: "1. Zugriff auf das Benutzerverwaltungs-Panel",
                        description: "Klicken Sie auf der Startseite im linken Menü auf Admin-Panel, um die Keycloak-Oberfläche zu öffnen.",
                    },
                    step2: {
                        title: "2. Benutzer finden",
                        description1: "Klicken Sie auf",
                        refresh: " Aktualisieren",
                        description2: ", um die aktuelle Benutzerliste abzurufen. Sie können dann nach Namen oder E-Mail suchen.",
                    },
                    step3: {
                        title: "3. Benutzer löschen",
                        description1: "Um einen Benutzer zu löschen, klicken Sie auf die drei Punkte am Ende der Zeile und wählen Sie",
                        delete: " Löschen",
                    },
                    step4: {
                        title: "4. Benutzer als Admin hinzufügen",
                        description1: "Wählen Sie die E-Mail des Benutzers aus, klicken Sie auf",
                        group: " Gruppe ",
                        description2: "und wählen Sie",
                        joinGroup: " Gruppe beitreten",
                        reminder: "Stellen Sie sicher, dass der Benutzer nicht aus der Benutzergruppe entfernt wird.",
                        description3: "Klicken Sie anschließend auf",
                        description4: ", um die Gruppen zu öffnen, wählen Sie die",
                        adminGroup: " admin ",
                        description5: "Gruppe und klicken Sie auf",
                        join: " Beitreten",
                        description6: "Nach dem Beitritt können Sie Benutzer bei Bedarf wieder aus der Admin-Gruppe entfernen, indem Sie auf",
                        leave: " Verlassen ",
                        description7: "klicken und bestätigen. Eine Erfolgsmeldung wird nach Abschluss angezeigt.",
                    }
                },
                photoDownload: {
                    title: "Gebäudefoto-Galerie",
                    description: "In diesem Abschnitt erfahren Sie, wie Sie nach hochgeladenen Gebäudefotos suchen und Bilder einfach herunterladen können.",
                    step1: {
                        title: "1. Suche nach Adresse",
                        description: "Geben Sie eine Adresse in die Suchleiste ein, um die neuesten Upload-Zeiten und die Anzahl der Fotos zu dieser Adresse anzuzeigen."
                    },
                    step2: {
                        title: "2. Fotos ansehen",
                        description1: "Klicken Sie auf ein Foto mit Adresse im rechten Bereich oder klicken Sie auf ",
                        viewAll: "'Alle anzeigen'",
                        description2: "um Filteroptionen zu verwenden und die Fotogalerie zu sortieren."
                    },
                    step3: {
                        title: "3. Fotos herunterladen",
                        description1: "Klicken Sie auf ein Foto im rechten Bereich und anschließend auf ",
                        download: "'Herunterladen'",
                        description2: "um es zu speichern.",
                        description3: "Mehrere Fotos werden als ZIP-Datei heruntergeladen, während einzelne Bilder im Originalformat gespeichert werden."
                    }
                },
                faq: {
                    title: "Häufig gestellte Fragen",
                    photoQuality: {
                        title: "Probleme mit der Fotoqualität",
                        q1: "F: Warum werden meine Fotos abgelehnt?",
                        a1: "A: Fotos können aufgrund von Schatten, Hindernissen, schlechter Beleuchtung oder falscher Perspektive abgelehnt werden.",
                        q2: "F: Was ist mit unvermeidbaren Hindernissen?",
                        a2: "A: Versuchen Sie verschiedene Blickwinkel oder vermerken Sie das Hindernis in Ihrer Einreichung."
                    },
                    upload: {
                        title: "Upload-Probleme",
                        q1: "F: Der Upload schlägt fehl. Was tun?",
                        a1: "A: Überprüfen Sie die Internetverbindung und stellen Sie sicher, dass die Dateigröße unter 10 MB liegt. Unterstützt: JPG, PNG.",
                        q2: "F: Wie lange dauert die Freigabe?",
                        a2: "A: 1–3 Werktage. Überprüfen Sie den Status im Upload-Verlauf."
                    },
                    address: {
                        title: "Adressprobleme",
                        q1: "F: Kann die richtige Adresse nicht finden?",
                        a1: "A: Verwenden Sie die automatische Standortfunktion auf der Upload-Seite. Reichen Sie eine Anfrage ein, um fehlende Adressen hinzuzufügen.",
                        q2: "F: Mehrere Gebäude auf einmal?",
                        a2: "A: Ja, aber jedes Foto benötigt die spezifische Adresse des Gebäudes."
                    },
                    technical: {
                        title: "Technische Probleme",
                        q1: "F: App läuft langsam?",
                        a1: "A: Löschen Sie den Browser-Cache, überprüfen Sie die Internetverbindung, verwenden Sie die neueste Version von Chrome oder Safari.",
                        q2: "F: Probleme bei der Anmeldung?",
                        a2: "A: Überprüfen Sie Ihre Zugangsdaten oder wenden Sie sich an den Administrator, um das Passwort zurückzusetzen."
                    }
                },
                main: {
                    title: "CityUp Anleitung",
                    welcome: "Willkommen zur CityUp-Anleitung. Wählen Sie ein Thema auf der linken Seite, um zu beginnen.",
                    quickHelpTitle: "Schnellhilfe - Häufige Fragen",
                    quickHelpIntro: "Klicken Sie auf eine der folgenden Fragen, um direkt zur Antwort zu gelangen:",
                    faqLinks: {
                        q1: "Warum werden meine Fotos abgelehnt?",
                        q2: "Mein Foto-Upload schlägt fehl. Was soll ich tun?",
                        q3: "Wie lange dauert es, bis Fotos genehmigt werden?",
                        q4: "Ich finde die richtige Adresse für mein Gebäude nicht",
                        q5: "Die Anwendung läuft langsam",
                        q6: "Ich habe Probleme beim Einloggen",
                        viewAll: "→ Alle FAQ anzeigen"
                    }
                },
                rankings: {
                    title: "Rangliste",
                    howToEarn: "📈 So sammelst du Punkte:",
                    points: {
                        dailyCheckIn: {
                            title: "1. Tägliches Einchecken durch Foto-Upload",
                            description: "Du erhältst 1 Punkt für das Hochladen eines Fotos pro Tag. Wenn du 7 Tage hintereinander Fotos hochlädst, kannst du bis zu 7 zusätzliche Punkte verdienen."
                        },
                        approvedPhotos: {
                            title: "2. Genehmigte Fotos",
                            description1: "Jedes genehmigte Foto bringt dir 5 Punkte. Wenn 5 hochgeladene Fotos in Folge genehmigt werden, erhältst du zusätzlich 5 Bonuspunkte.",
                            description2: "Beispiel: Bei der Upload-Reihenfolge der Fotos 1 bis 6 – wenn das 3. Foto nicht genehmigt wird, während die anderen genehmigt sind, erhältst du keine zusätzlichen 5 Bonuspunkte. In diesem Fall wird die Bonus-Berechnung ab Foto 4 neu gestartet. Wenn Foto 7 und 8 genehmigt werden, kannst du ab Foto 4 die 5 Bonuspunkte erhalten."
                        },
                        likes: {
                            title: "3. Likes von anderen Nutzern",
                            description: "Jedes Like von anderen Nutzern bringt dir 1 Punkt. Wenn das Like zurückgezogen wird, verfällt der Punkt. Likes für dein eigenes Foto zählen nicht, und jedes Foto kann nur einmal geliked werden."
                        }
                    },
                    leaderboard: {
                        title: "📊 Über die Rangliste:",
                        displayScope: {
                            title: "1. Anzeigebereich",
                            description: "Es werden nur die Top 50 Nutzer nach Gesamtpunkten angezeigt. Nutzer mit 0 Punkten erscheinen nicht in der Rangliste."
                        },
                        pagination: {
                            title: "2. Seitennavigation",
                            description: "Wenn dein Rang nicht auf der ersten Seite erscheint, benutze die Seitennavigation, um direkt zu deiner Position zu springen, oder kehre über die Schaltfläche zur ersten Seite zurück."
                        }
                    }
                }
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