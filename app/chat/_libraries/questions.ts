import { Question } from "chat/_models";

const CHOICES = {
    GENDER: ["Male", "Female"],
    CONFIRMATION: ["Yes", "No"],
    CHANCE: ["Extremely likely", "Very likely", "Likely", "Undecided", "Unlikely", "Very unlikely", "Extremely unlikely"],
    CONFIDENCE: ["Extremely confident", "Highly confident", "Somewhat confident", "Confident", "Unsure", "Not confident", "Extremely unconfident"],
}

const QUESTION_BANK = {
    AGE: {
        question: "What is your age?",
        type: "numeric",
        parameter: "age",
        fallback: "I've already asked your age before...",
    },
    GENDER: {
        question: "What is your gender?",
        type: "choice",
        choices: CHOICES.GENDER,
        parameter: "age",
        fallback: "You've informed me of your gender already...",
    },
    CITY_ADD: {
        question: "Do you live within Metro Manila?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "city_add",
        fallback: "I already know where you live...",
    },
    OCC_FATHER: {
        question: "Does your father have a job?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "occ_father",
        fallback: "I've recorded already what your father does for a living...",
    },
    OCC_MOTHER: {
        question: "Does your mother have a job?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "occ_mother",
        fallback: "I've recorded already what your mother does for a living...",
    },
    ACCOUNTANCY: {
        question: "Do you plan to take up a degree in Accounting?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "accountancy",
        fallback: "And you're interested in Accountancy...",
    },
    ENGINEERING: {
        question: "Do you plan to take up a degree in Engineering?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "engineering",
        fallback: "And you're interested in Engineering...",
    },
    IT: {
        question: "Do you plan to take up a degree in IT?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "it",
        fallback: "And you're interested in IT...",
    },
    HEALTH: {
        question: "Do you plan to take up a degree in Health?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "health",
        fallback: "And you're interested in Health...",
    },
    COE_COD: {
        question: "Does it matter to you whether the university you'll enroll in is a CHED-recognized Center of Excellence and/or Center of Development?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "coe_cod",
        fallback: "I've already asked about your interest in CHED accreditation status...",
    },
    PACUCOA: {
        question: "Does it matter to you whether the university you'll enroll in is accredited by PACUCOA?",
        type: "choice",
        choices: CHOICES.CONFIRMATION,
        parameter: "pacucoa",
        fallback: "I've already asked about your interest in PACUCOA accreditation status...",
    },
    CHANCE_UE: {
        question: "How likely are you to take an entrance exam in the University of the East?",
        type: "choice",
        choices: CHOICES.CHANCE,
        parameter: "chance_ue",
        fallback: "I think I've already asked about your interest in taking an entrance exam in UE...",
    },
    CONFIDENT_UE: {
        question: "How confident do you feel, that if you were to take an entrance exam in the University of the East, you will pass?",
        type: "choice",
        choices: CHOICES.CONFIDENCE,
        parameter: "confident_ue",
        fallback: "I think I've already asked about your confidence in passing an entrance exam in UE...",
    },
    END: {
        question: "I have no more questions!",
        type: "choice",
        choices: CHOICES.CONFIDENCE,
        parameter: "end",
        fallback: "I think I've already asked about your confidence in passing an entrance exam in UE...",
    },
};

const questions: Question = {
    answer: [],
    ...QUESTION_BANK.CHANCE_UE,
    left: {
        answer: ["Very unlikely"],
        ...QUESTION_BANK.END,
        result: {
            extremely_considered: 0, 
            high_consideration: 0, 
            moderate_consideration: 0,
            slight_consideration: 0, 
            neutral: 0, 
            not_at_all_considered: 0, 
            did_not_consider: 0
        }
    }, 
    right: {
        answer: ["Extremely likely", "Very likely", "Likely", "Undecided", "Unlikely", "Extremely unlikely"],
        ...QUESTION_BANK.CONFIDENT_UE,
        left: {
            answer: ["Unsure"],
            ...QUESTION_BANK.ENGINEERING,
            left: {
                answer: ["Yes"],
                ...QUESTION_BANK.END,
            }, 
            right: {
                answer: ["No"],
                ...QUESTION_BANK.END,
            }
        },
        right: {
            answer: ["Extremely confident", "Highly confident", "Somewhat confident", "Confident"],
            ...QUESTION_BANK.CHANCE_UE,
            left: {
                answer: ["Extremely likely"],
                ...QUESTION_BANK.PACUCOA,
                left: {
                    answer: ["No"],
                    ...QUESTION_BANK.AGE,
                    left: {
                        answer: ["<= 16"],
                        ...QUESTION_BANK.GENDER,
                        left: {
                            answer: ["Female"],
                            ...QUESTION_BANK.END
                        },
                        right: {
                            answer: ["Male"],
                            ...QUESTION_BANK.HEALTH,
                            left: {
                                answer: ["No"],
                                ...QUESTION_BANK.END,
                            },
                            right: {
                                answer: ["Yes"],
                                ...QUESTION_BANK.END
                            }
                        }
                    },
                    right: {
                        answer: ["> 16"],
                        ...QUESTION_BANK.OCC_MOTHER,
                        left: {
                            answer: ["No"],
                            ...QUESTION_BANK.IT,
                            left: {
                                answer: ["Yes"],
                                ...QUESTION_BANK.END,
                            },
                            right: {
                                answer: ["No"],
                                ...QUESTION_BANK.END,
                            }
                        },
                        right: {
                            answer: ["Yes"],
                            ...QUESTION_BANK.END,
                        }
                    }
                },
                right: {
                    answer: ["Yes"],
                    ...QUESTION_BANK.END
                }
            },
            right: {
                answer: ["Very likely", "Likely", "Undecided", "Unlikely", "Extremely unlikely"],
                ...QUESTION_BANK.CHANCE_UE,
                left: {
                    answer: ["Very likely", "Likely", "Undecided"],
                    ...QUESTION_BANK.CONFIDENT_UE,
                    left: {
                        answer: ["Extremely confident"],
                        ...QUESTION_BANK.CHANCE_UE,
                        left: {
                            answer: ["Very likely", "Undecided"],
                            ...QUESTION_BANK.AGE,
                            left: {
                                answer: ["<= 16"],
                                ...QUESTION_BANK.END
                            },
                            right: {
                                answer: ["> 16"],
                                ...QUESTION_BANK.HEALTH,
                                left: {
                                    answer: ["No"],
                                    ...QUESTION_BANK.END
                                },
                                right: {
                                    answer: ["Yes"],
                                    ...QUESTION_BANK.END
                                }
                            }
                        },
                        right: {
                            answer: ["Likely"],
                            ...QUESTION_BANK.GENDER,
                            left: {
                                answer: ["Female"],
                                ...QUESTION_BANK.END
                            },
                            right: {
                                answer: ["Male"],
                                ...QUESTION_BANK.END
                            }
                        }
                    },
                    right: {
                        answer: ["Highly confident", "Somewhat confident", "Confident"],
                        ...QUESTION_BANK.COE_COD,
                        left: {
                            answer: ["No"],
                            ...QUESTION_BANK.CONFIDENT_UE,
                            left: {
                                answer: ["Somewhat confident", "Confident"],
                                ...QUESTION_BANK.IT,
                                left: {
                                    answer: ["No"],
                                    ...QUESTION_BANK.GENDER,
                                    left: {
                                        answer: ["Female"],
                                        ...QUESTION_BANK.CITY_ADD,
                                        left: {
                                            answer: ["Yes"],
                                            ...QUESTION_BANK.END
                                        },
                                        right: {
                                            answer: ["No"],
                                            ...QUESTION_BANK.AGE,
                                            left: {
                                                answer: ["<= 16"],
                                                ...QUESTION_BANK.END
                                            },
                                            right: {
                                                answer: ["> 16"],
                                                ...QUESTION_BANK.HEALTH,
                                                left: {
                                                    answer: ["Yes"],
                                                    ...QUESTION_BANK.END,
                                                },
                                                right: {
                                                    answer: ["No"],
                                                    ...QUESTION_BANK.END
                                                }
                                            }
                                        }
                                    },
                                    right: {
                                        answer: ["Male"],
                                        ...QUESTION_BANK.HEALTH,
                                        left: {
                                            answer: ["No"],
                                            ...QUESTION_BANK.END
                                        },
                                        right: {
                                            answer: ["Yes"],
                                            ...QUESTION_BANK.END
                                        }
                                    }
                                },
                                right: {
                                    answer: ["Yes"],
                                    ...QUESTION_BANK.CHANCE_UE,
                                    left: {
                                        answer: ["Very likely", "Undecided"],
                                        ...QUESTION_BANK.END
                                    },
                                    right: {
                                        answer: ["Likely"],
                                        ...QUESTION_BANK.CITY_ADD,
                                        left: {
                                            answer: ["Yes"],
                                            ...QUESTION_BANK.END,
                                        },
                                        right: {
                                            answer: ["No"],
                                            ...QUESTION_BANK.END,
                                        }
                                    }
                                }
                            },
                            right: {
                                answer: ["Highly confident"],
                                ...QUESTION_BANK.OCC_FATHER,
                                left: {
                                    answer: ["Yes"],
                                    ...QUESTION_BANK.OCC_MOTHER,
                                    left: {
                                        answer: ["No"],
                                        ...QUESTION_BANK.END
                                    },
                                    right: {
                                        answer: ["Yes"],
                                        ...QUESTION_BANK.ENGINEERING,
                                        left: {
                                            answer: ["No"],
                                            ...QUESTION_BANK.END
                                        },
                                        right: {
                                            answer: ["Yes"],
                                            ...QUESTION_BANK.END
                                        }
                                    }
                                },
                                right: {
                                    answer: ["No"],
                                    ...QUESTION_BANK.HEALTH,
                                    left: {
                                        answer: ["No"],
                                        ...QUESTION_BANK.END,
                                    },
                                    right: {
                                        answer: ["Yes"],
                                        ...QUESTION_BANK.END,
                                    }
                                }
                            }
                        },
                        right: {
                            answer: ["Yes"],
                            ...QUESTION_BANK.END
                        }
                    }
                },
                right: {
                    answer: ["Unlikely", "Extremely unlikely"],
                    ...QUESTION_BANK.END
                }
            }
        }
    }
};

export default questions;