export const validateProfessorCourseLimit = (slotsByStep, selectedViewStep, professor, course, group, day, startHour, consecutiveHours) => {
    const currentStepSlots = slotsByStep[selectedViewStep?.id] || [];

    // Filtrer les créneaux pour le professeur, le cours et le groupe donné
    const professorCourseSlots = currentStepSlots.filter(slot =>
        slot.professor.id === professor.id &&
        slot.course.code === course.code &&
        slot.group === group
    );

    // Calculer le total des heures déjà attribuées pour ce cours, ce professeur et ce groupe
    const totalHours = professorCourseSlots.reduce((total, slot) => {
        const slotHours = parseInt(slot.endTime) - parseInt(slot.startTime);
        return total + slotHours;
    }, 0);

    // Vérifier si l'ajout de ce créneau dépasse la limite de 3 heures
    if (totalHours + consecutiveHours > 3) {
        return false; // Limite dépassée
    }

    return true; // Limite respectée
};