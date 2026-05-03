// DEV
const PROTOCOL = "http";
const DOMAIN = "localhost";
const PORT = "8080";
const CONTEXT_ROOT = "felicita";
const VERSION = "/v0";
const API = "/api";
export const BASE_PATH = `${PROTOCOL}://${DOMAIN}:${PORT}/${CONTEXT_ROOT}`;

// Staging
// const PROTOCOL = "http";
// const DOMAIN = "stg-api.felicitatrips.com"; // staging backend domain
// const PORT = "443"; // HTTPS
// const CONTEXT_ROOT = "felicita";
// const VERSION = "/v0";
// const API = "/api";
// export const BASE_PATH = `${PROTOCOL}://${DOMAIN}/${CONTEXT_ROOT}`;

// Production
// const PROTOCOL = "https";
// const DOMAIN = "api.felicitatrips.com"; // production backend domain
// const PORT = "443"; // if using HTTPS (omit port in URL)
// const CONTEXT_ROOT = "felicita";
// const VERSION = "/v0";
// const API = "/api";
// export const BASE_PATH = `${PROTOCOL}://${DOMAIN}/${CONTEXT_ROOT}`;

// http://159.198.43.146:8080/felicita
const LINK_BAR = "/link-bar";
const NAV_BAR = "/nav-bar";
const HERO_SECTION = "/hero-section";
const WHY_CHOOSE_US = "/why-choose-us";
const FAQ = "/faq";
const PARTNERS = "/partner";
const OUR_SERVICES = "/our-service";
const WORK_FLOW = "/work-flow";
const ACCOMMODATION = "/accommodation";
const DESTINATIONS = "/destination";
const BLOG = "/blog";
const TOUR = "/tour";
const PACKAGE = "/package";
const REVIEW = "/review";
const USER_LEVEL = "/user-level";
const USER_BENEFITS = "/user-benefits";
const PROMOTIONS = "/promotions";
const GALLERY = "/gallery";
const ACTIVITIES = "/activity";
const FOOTER = "/footer";
const PLAN_YOUR_TRIP = "/plan-your-trip";
const SERVICE_PROVIDER = "/service-provider";
const VEHICLES = "/vehicles";
const EMPLOYEE = "/employee";
const INQUIRY = "/inquiry";
const OUR_STORY = "/our-story";
const CONTACT_US = "/contact-us";
const WISH_LIST = "/wish-list";
const AUTH = "/auth";
const USER_PROFILE = "/user-profile";
const HISTORY_MANAGEMENT = "/history-management";
const COUPON = "/coupon";
const USER_NOTIFICATION_PERMISSIONS = "/user-notification-permissions";
const ACCOUNT_SECURITY = "/account-security";
const BOOKING = "/booking";
const BROWSER_HISTORY = "/browser-history";
const COMMON = "/common";
const SEASONS = "/seasons";
const PRIVILEGES = "/privileges";
const ROLES = "/roles";
const USERS = "/users";


// Auth
export const LOGIN = `${BASE_PATH}${API}${VERSION}${AUTH}/login`;
export const LOGOUT = `${BASE_PATH}${API}${VERSION}${AUTH}/logout`;
export const SIGNUP = `${BASE_PATH}${API}${VERSION}${AUTH}/signup`;
export const GET_USER_DETAILS_FOR_LOGIN_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/me`;
export const UPDATE_PASSWORD_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/change-password`;
export const RESET_PASSWORD_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/reset-password`;
export const UPDATE_SECRET_QUESTIONS_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/update-secret-questions`;
export const USERNAME_PASSWORD_VALIDATION_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/username-password-validation`;
export const GET_ACTIVE_SECRET_QUESTIONS_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/secret-questions`;
export const GET_SECRET_QUESTIONS_BY_USER_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/secret-questions-by-user`;

// User Profile
export const UPDATE_USER_PROFILE_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/update-account`;
export const GET_USER_PROFILE_SIDE_BAR_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/side-bar`;
export const GET_USER_PROFILE_USER_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/user`;
export const GET_USER_PROFILE_TOUR_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/tour-reviews`;
export const GET_USER_PROFILE_ACTIVITY_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/activity-reviews`;
export const GET_USER_PROFILE_DESTINATION_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/destination-reviews`;
export const GET_USER_PROFILE_PACKAGE_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/package-reviews`;
export const GET_USER_PROFILE_ALL_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/reviews`;
export const GET_USER_PROFILE_WALLET_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_PROFILE}/wallet`;

// History Management
export const GET_HISTORY_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${HISTORY_MANAGEMENT}/history-data`;

// Coupons
export const GET_COUPON_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${COUPON}/user-details`;

// User Notification Permissions
export const GET_USER_NOTIFICATION_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_NOTIFICATION_PERMISSIONS}/details`;
export const UPDATE_USER_NOTIFICATION_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER_NOTIFICATION_PERMISSIONS}/update`;

// Account Security
export const GET_ACCOUNT_SECURITY_DETAILS = `${BASE_PATH}${API}${VERSION}${ACCOUNT_SECURITY}/details`;
export const REQUEST_MOBILE_VERIFY_SECURITY_DETAILS = `${BASE_PATH}${API}${VERSION}${ACCOUNT_SECURITY}/mobile-verify`;
export const UPDATE_MOBILE_VERIFY_SECURITY_DETAILS = `${BASE_PATH}${API}${VERSION}${ACCOUNT_SECURITY}/mobile-update`;
export const REQUEST_EMAIL_VERIFY_SECURITY_DETAILS = `${BASE_PATH}${API}${VERSION}${ACCOUNT_SECURITY}/email-verify`;
export const UPDATE_EMAIL_VERIFY_SECURITY_DETAILS = `${BASE_PATH}${API}${VERSION}${ACCOUNT_SECURITY}/email-update`;

// Bookings
export const GET_COMPLETED_BOOKINGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BOOKING}/completed`;
export const GET_UPCOMING_BOOKINGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BOOKING}/upcoming`;
export const GET_REQUESTED_BOOKINGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BOOKING}/requested`;
export const GET_CANCELLED_BOOKINGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BOOKING}/cancelled`;
export const GET_PENDING_BOOKINGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BOOKING}/pending`;
export const INSERT_BOOKINGS_INQUIRY_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BOOKING}/tour-book-inquiry`;
export const CANCELLED_PENDING_BOOKINGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BOOKING}/cancelled-pending`;

// User Benefits
export const GET_ALL_ACTIVE_USER_BENEFITS_BE = `${BASE_PATH}${API}${VERSION}${USER_BENEFITS}/active`;
export const GET_USER_PROFILE_USER_BENEFITS_DATA = `${BASE_PATH}${API}${VERSION}${USER_BENEFITS}/user-profile`;

// Link Bar
export const GET_ALL_LINK_BAR_DATA = `${BASE_PATH}${API}${VERSION}${LINK_BAR}/all`;
export const GET_ACTIVE_LINK_BAR_DATA = `${BASE_PATH}${API}${VERSION}${LINK_BAR}/active`;

// Nav Bar
export const GET_ACTIVE_NAV_BAR_DATA = `${BASE_PATH}${API}${VERSION}${NAV_BAR}/active`;

// Hero Sections
export const GET_ACTIVE_HOME_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/home`;
export const GET_ACTIVE_ABOUT_US_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/about-us`;
export const GET_ACTIVE_CONTACT_US_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/contact-us`;
export const GET_ACTIVE_BLOG_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/blog`;
export const GET_ACTIVE_FAQ_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/faq`;
export const GET_ACTIVE_TOUR_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/tour`;
export const GET_ACTIVE_PACKAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/package`;
export const GET_ACTIVE_DESTINATION_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/destination`;
export const GET_ACTIVE_ACTIVITY_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/activity`;
export const GET_ACTIVE_PACKAGE_SCHEDULE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/package-schedule`;
export const GET_ACTIVE_BOOKED_TOUR_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/booked-tour`;
export const GET_ACTIVE_VEHICLE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/vehicle`;
export const GET_ACTIVE_VEHICLE_SPECIFICATION_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/vehicle-specification`;
export const GET_ACTIVE_VEHICLE_TYPES_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/vehicle-types`;
export const GET_ACTIVE_SEASONS_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/seasons`;

// Why Choose Us
export const GET_ACTIVE_WHY_CHOOSE_US_DATA = `${BASE_PATH}${API}${VERSION}${WHY_CHOOSE_US}/active`;

// Our Services
export const GET_ACTIVE_OUR_SERVICES_DATA = `${BASE_PATH}${API}${VERSION}${OUR_SERVICES}/active`;

// Destinations
export const GET_DESTINATIONS_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}`;
export const GET_ACTIVE_DESTINATIONS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/active-destinations`;
export const GET_ACTIVE_DESTINATIONS_CATEGORIES_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/active-categories`;
export const GET_DESTINATION_CATEGORY_DETAILS_BY_ID = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/category-details-by-id`;
export const GET_POPULAR_DESTINATIONS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/popular-destinations`;
export const GET_NEW_DESTINATIONS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/new-destinations`;
export const GET_TRENDING_DESTINATIONS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/trending-destinations`;
export const ADD_TRENDING_DESTINATIONS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/trending-destinations-add`;
export const TERMINATE_TRENDING_DESTINATIONS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/trending-destinations-terminate`;
export const GET_ACTIVE_DESTINATIONS_FOR_TOUR_MAP_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/tour-map`;
export const GET_DESTINATIONS_DETAILS_BY_TOUR_ID_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/tour-id`;
export const GET_DESTINATIONS_DETAILS_BY_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/destinations`;
export const GET_DESTINATIONS_HISTORY_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/history`;
export const GET_DESTINATIONS_HISTORY_IMAGES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/history-images`;
export const GET_DESTINATIONS_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/reviews`;
export const ADD_DESTINATION_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/add-destination`;
export const UPDATE_DESTINATION_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/update-destination`;
export const GET_DESTINATION_DETAILS_FOR_TERMINATE_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/destination-for-terminate`;
export const TERMINATE_DESTINATION_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/terminate-destination`;
export const GET_DESTINATION_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/destination-statistics`;
export const GET_DESTINATION_CATEGORIES_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/destination-categories-statistics`;
export const ADD_DESTINATION_CATEGORY = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/add-destination-category`;
export const UPDATE_DESTINATION_CATEGORY = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/update-destination-category`;
export const TERMINATE_DESTINATION_CATEGORY = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/terminate-destination-category`;
export const GET_DESTINATIONS_NAMES_FOR_TOUR_DATA = `${BASE_PATH}${API}${VERSION}${DESTINATIONS}/destination-names`;

// Tours
export const GET_TOUR_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}`;
export const GET_ALL_TOURS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/all`;
export const GET_ACTIVE_TOURS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/active`;
export const GET_POPULAR_TOURS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/popular`;
export const GET_TOURS_DETAILS_BY_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tours`;
export const GET_TOURS_HISTORY_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/history`;
export const GET_TOURS_HISTORY_IMAGES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/history-images`;
export const GET_TOURS_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/reviews`;
export const GET_TOUR_EXTRA_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-extra-details`;
export const GET_TOUR_DAY_TO_DAY_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-details`;
export const GET_ALL_TOURS_BASIC_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/all-tours-basic`;
export const GET_TOUR_MAP_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-map`;
export const GET_TOURS_FOR_TERMINATE_DATA= `${BASE_PATH}${API}${VERSION}${TOUR}/tour-for-terminate`;
export const TERMINATE_TOUR_DATA= `${BASE_PATH}${API}${VERSION}${TOUR}/terminate-tour`;
export const UPDATE_TOUR_DATA= `${BASE_PATH}${API}${VERSION}${TOUR}/update-tour`;
export const CREATE_TOUR_DATA= `${BASE_PATH}${API}${VERSION}${TOUR}/add-tour`;
export const GET_TOUR_ALL_DETAILS_BY_ID_DATA= `${BASE_PATH}${API}${VERSION}${TOUR}/tout-all-details`;
export const GET_TOUR_IDS_AND_NAMES_DATA= `${BASE_PATH}${API}${VERSION}${TOUR}/tourId-and-tourName`;
export const GET_TOUR_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-statistics`;
export const GET_TOUR_SCHEDULE_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-schedule-statistics`;
export const GET_TOUR_CATEGORY_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-category-statistics`;
export const GET_TOUR_TYPE_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-type-statistics`;
export const GET_TOUR_DETAILS_FOR_PACKAGE_DATA = `${BASE_PATH}${API}${VERSION}${TOUR}/tour-details-for-add-package`;


// Packages
export const GET_PACKAGE_DETAILS_BY_PACKAGE_ID_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}`;
export const GET_PACKAGE_ALL_DETAILS_BY_PACKAGE_ID_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-all-details`;
export const GET_ALL_PACKAGES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/all`;
export const GET_ACTIVE_PACKAGES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/active`;
export const GET_PACKAGES_DETAILS_BY_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/packages`;
export const GET_PACKAGES_REVIEWS_DETAILS_DATA = `${BASE_PATH}${VERSION}${API}${PACKAGE}/reviews`;
export const GET_PACKAGE_DETAILS_BY_TOUR_ID_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-details`;
export const GET_PACKAGE_EXTRA_DETAILS_BY_TOUR_ID_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-extra-details`;
export const GET_PACKAGE_SCHEDULES_BY_TOUR_ID_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-schedules`;
export const GET_PACKAGE_SCHEDULES_DETAILS_BY_PACKAGE_ID_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-schedules-details`;
export const GET_PACKAGE_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/reviews`;
export const GET_PACKAGE_HISTORY_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/history`;
export const GET_PACKAGE_HISTORY_IMAGES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/history-images`;
export const GET_PACKAGE_COMPARE_DETAILS_BY_TOUR_ID_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-compare`;
export const GET_PACKAGES_FOR_TERMINATE_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-for-terminate`;
export const TERMINATE_PACKAGE_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/terminate-package`;
export const CREATE_PACKAGE_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/add-package`;
export const UPDATE_PACKAGE_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/update-package`;
export const GET_PACKAGE_NAMES_AND_IDS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/packageId-and-packageName`;
export const GET_PACKAGE_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-statistics`;
export const GET_PACKAGE_SCHEDULE_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-schedule-statistics`;
export const GET_PACKAGE_TYPE_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${PACKAGE}/package-type-statistics`;

// Activities
export const GET_ACTIVITY_DETAILS_BY_ACTIVITY_ID_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}`;
export const GET_ALL_ACTIVITIES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/all`;
export const GET_ACTIVE_ACTIVITIES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/active`;
export const GET_ACTIVITIES_DETAILS_BY_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/activities`;
export const GET_ALL_ACTIVITY_CATEGORIES_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/category`;
export const GET_ACTIVE_ACTIVITY_CATEGORIES_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/active-category`;
export const GET_ACTIVITY_REVIEWS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/reviews`;
export const GET_ACTIVITY_HISTORY_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/history`;
export const GET_ACTIVITY_HISTORY_IMAGES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/history-images`;
export const GET_ACTIVITIES_NAMES_AND_IDS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/activityId-and-activityName`;
export const TERMINATE_ACTIVITY_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/terminate-activity`;
export const ADD_ACTIVITY_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/add-activity`;
export const UPDATE_ACTIVITY_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/update-activity`;
export const GET_ACTIVITIES_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/activities-statistics`;
export const GET_ACTIVITIES_SCHEDULE_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/activities-schedule-statistics`;
export const GET_ACTIVITIES_CATEGORIES_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/activities-categories-statistics`;
export const GET_ACTIVITIES_BY_DESTINATION_ID_DATA = `${BASE_PATH}${API}${VERSION}${ACTIVITIES}/activities-by-destinationId`;

// Blogs
export const GET_ALL_BLOGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/all`;
export const GET_ACTIVE_BLOGS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/active`;
export const GET_BLOGS_TAG_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/tags`;
export const GET_BLOGS_TAG_BY_BLOG_ID_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/tags`;
export const GET_BLOGS_DERAILS_BY_WRITER_NAME_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/writer`;
export const GET_BLOGS_DERAILS_BY_TAG_NAME_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/tag`;
export const GET_BLOGS_DERAILS_BY_BLOG_ID_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/blog-details`;
export const ADD_BLOG_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/add-blog`;
export const ADD_BLOG_BOOKMARK_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/add-bookmark`;
export const ADD_BLOG_REACT_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/add-react`;
export const ADD_BLOG_COMMENT_REACT_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/add-comment-react`;
export const ADD_BLOG_COMMENT_DATA = `${BASE_PATH}${API}${VERSION}${BLOG}/add-comment`;

// Gallery
export const GET_ALL_GALLERY_IMAGES_DATA = `${BASE_PATH}${API}${VERSION}${GALLERY}/all`;
export const GET_ACTIVE_GALLERY_IMAGES_DATA = `${BASE_PATH}${API}${VERSION}${GALLERY}/active`;

// Inquiry
export const ADD_INQUIRY_DATA = `${BASE_PATH}${API}${VERSION}${INQUIRY}/create`;

// Footer
export const GET_ALL_FOOTER_DATA = `${BASE_PATH}${API}${VERSION}${FOOTER}/all`;
export const GET_ACTIVE_FOOTER_DATA = `${BASE_PATH}${API}${VERSION}${FOOTER}/active`;

// Our Story
export const GET_OUR_STORY_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${OUR_STORY}/details`;

// Contact Us
export const GET_CONTACT_US_CONTACT_METHODS_DATA = `${BASE_PATH}${API}${VERSION}${CONTACT_US}/contact-methods`;

// FAQ
export const GET_ALL_FAQ_DATA = `${BASE_PATH}${API}${VERSION}${FAQ}/all`;
export const GET_ACTIVE_FAQ_DATA = `${BASE_PATH}${API}${VERSION}${FAQ}/active`;
export const UPDATE_FAQ_VIEW_COUNT_DATA = `${BASE_PATH}${API}${VERSION}${FAQ}/view-count`;
export const GET_FAQ_OPTIONS_DATA = `${BASE_PATH}${API}${VERSION}${FAQ}/options`;
export const ADD_FAQ_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${FAQ}/insert-faq-request`;

// Employees
export const GET_CEO_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/ceo-details`;
export const GET_EMPLOYEE_BASIC_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/employee-basic-details`;
export const GET_EMPLOYEE_BASIC_DETAILS_PARAMS_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/employee-basic-details-params`;
export const GET_EMPLOYEE_FULL_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/employee-full-details`;
export const GET_EMPLOYEE_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/employee-statistics`;
export const CREATE_EMPLOYEE_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/create-employee`;
export const GET_EMPLOYEE_CREATE_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/create-employee-data`;
export const GET_EMPLOYEE_DETAILS_FOR_ASSIGN_TOUR_DATA = `${BASE_PATH}${API}${VERSION}${EMPLOYEE}/employee-details-for-assign-tour`;


// Wish List
export const ADD_ACTIVITY_WISH_LIST_DATA = `${BASE_PATH}${API}${VERSION}${WISH_LIST}/add-activity-wish-list`;
export const ADD_DESTINATION_WISH_LIST_DATA = `${BASE_PATH}${API}${VERSION}${WISH_LIST}/add-destination-wish-list`;
export const ADD_TOUR_WISH_LIST_DATA = `${BASE_PATH}${API}${VERSION}${WISH_LIST}/add-tour-wish-list`;
export const ADD_PACKAGE_WISH_LIST_DATA = `${BASE_PATH}${API}${VERSION}${WISH_LIST}/add-package-wish-list`;
export const GET_WIS_LIST_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${WISH_LIST}/details`;

// Browser History
export const ADD_BROWSER_HISTORY_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${BROWSER_HISTORY}/add`;

// Common
export const GET_ALL_CATEGORIES_DATA = `${BASE_PATH}${API}${VERSION}${COMMON}/all-categories`;
export const GET_NOTIFICATIONS_DATA = `${BASE_PATH}${API}${VERSION}${COMMON}/notifications`;
export const UPDATE_NOTIFICATIONS_READ_DATA = `${BASE_PATH}${API}${VERSION}${COMMON}/notifications-read`;
export const GET_ALL_UNREAD_NOTIFICATION_COUNT_DATA = `${BASE_PATH}${API}${VERSION}${COMMON}/unread-notification-count`;
export const UPDATE_ALL_UNREAD_NOTIFICATIONS_READ_DATA = `${BASE_PATH}${API}${VERSION}${COMMON}/read-all-unread-notifications`;

// Others
export const UPLOAD_IMAGE_TO_CLOUDINARY =
  "https://api.cloudinary.com/v1_1/dnsenutq2/image/upload";
export const WHETHER_DETAILS = `${BASE_PATH}${API}${VERSION}${COMMON}/weather`;

// Vehicles
export const GET_VEHICLE_SPECIFICATION_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${VEHICLES}/specification`;
export const GET_VEHICLE_SPECIFICATION_DETAILS_BY_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${VEHICLES}/specification`;
export const GET_VEHICLE_SPECIFICATION_FILTERS_DATA = `${BASE_PATH}${API}${VERSION}${VEHICLES}/specification-filters`;
export const GET_VEHICLE_TYPES_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${VEHICLES}/vehicle-types`;
export const GET_VEHICLE_TYPES_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${VEHICLES}/vehicle-types`;

// Seasons
export const GET_ACTIVE_SEASONS_BASIC_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${SEASONS}/basic-details`;
export const GET_SEASONS_DETAILS_BY_SEASON_ID_DATA = `${BASE_PATH}${API}${VERSION}${SEASONS}`;

export const GET_TOUR_DETAILS_BY_ID_BE = `${BASE_PATH}${VERSION}${API}${TOUR}`;

export const GET_VISIBLE_PARTNERS = `${BASE_PATH}${VERSION}${API}${PARTNERS}/visible`;

export const GET_ACTIVE_WORK_FLOW = `${BASE_PATH}${VERSION}${API}${WORK_FLOW}/active`;

export const GET_ALL_ACTIVE_REVIEW_BE = `${BASE_PATH}${VERSION}${API}${REVIEW}/active`;
export const GET_ALL_ACTIVE_USER_LEVEL_BE = `${BASE_PATH}${API}${VERSION}${USER_LEVEL}/active`;
export const GET_ALL_ACTIVE_USER_LEVEL_WITH_BENEFITS_BE = `${BASE_PATH}${API}${VERSION}${USER_LEVEL}/active-with-benefits`;
export const GET_ALL_ACTIVE_PROMOTIONS_BE = `${BASE_PATH}${API}${VERSION}${PROMOTIONS}/active`;

export const GET_PLAN_YOUR_TRIP_ACTIVE_DESTINATIONS = `${BASE_PATH}${API}${VERSION}${PLAN_YOUR_TRIP}/active`;
export const GET_PLAN_YOUR_TRIP_DESTINATIONS_TOURS = `${BASE_PATH}${API}${VERSION}${PLAN_YOUR_TRIP}/tours`;

// Accommodations
export const GET_AVAILABLE_ACCOMMODATION = `${BASE_PATH}${VERSION}${API}${ACCOMMODATION}/available`;
export const GET_HOTEL_DETAILS_SECTION_BE = `${BASE_PATH}${VERSION}${API}${ACCOMMODATION}/hotels-section`;
export const GET_RESORT_DETAILS_SECTION_BE = `${BASE_PATH}${VERSION}${API}${ACCOMMODATION}/resorts-section`;
export const GET_VILLA_DETAILS_SECTION_BE = `${BASE_PATH}${VERSION}${API}${ACCOMMODATION}/villas-section`;
export const GET_HOSTEL_DETAILS_SECTION_BE = `${BASE_PATH}${VERSION}${API}${ACCOMMODATION}/hostels-section`;
export const GET_RESTAURANT_DETAILS_SECTION_BE = `${BASE_PATH}${VERSION}${API}${ACCOMMODATION}/restaurants-section`;

// Service Providers
export const GET_SERVICE_PROVIDER_DETAILS = (id: string) =>
  `${BASE_PATH}${API}${VERSION}${SERVICE_PROVIDER}/${id}`;

// vehicles
export const GET_ACTIVE_VEHICLES_BE = `${BASE_PATH}${API}${VERSION}${VEHICLES}/active-vehicles`;
export const GET_VEHICLES_BY_ID_BE = (id: string) =>
  `${BASE_PATH}${API}${VERSION}${VEHICLES}/${id}`;

// Privileges
export const GET_ALL_PRIVILEGES_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/all-privileges`;
export const GET_PRIVILEGES_NAMES_AND_IDS_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/privileges-names-and-ids`;
export const GET_PRIVILEGE_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/privilege-details-by-id`;
export const GET_PRIVILEGE_BASIC_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/privilege-basic-details-by-id`;
export const CREATE_PRIVILEGE_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/create-privilege`;
export const UPDATE_PRIVILEGE_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/update-privilege`;
export const TERMINATE_PRIVILEGE_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/terminate-privilege`;
export const GET_PRIVILEGES_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${PRIVILEGES}/privileges-statistics`;

export const GET_ALL_ROLES_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/all-roles`;
export const GET_ROLES_NAMES_AND_IDS_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/role-names-and-ids`;
export const GET_ROLE_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/role-details-by-id`;
export const GET_ROLE_BASIC_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/role-basic-details-by-id`;
export const CREATE_ROLE_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/create-role`;
export const UPDATE_ROLE_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/update-role`;
export const TERMINATE_ROLE_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/terminate-role`;
export const GET_ROLES_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${ROLES}/roles-statistics`;

// Users
export const GET_USER_NAMES_AND_IDS_WITHOUT_EMPLOYEES_DATA = `${BASE_PATH}${API}${VERSION}${USERS}/user-names-and-ids-without-employees`;
export const GET_USER_BASIC_DETAILS_BY_USER_ID_DATA = `${BASE_PATH}${API}${VERSION}${USERS}/user-basic-details-by-user-id`;