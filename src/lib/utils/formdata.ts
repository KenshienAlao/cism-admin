export const prepareFormData = <T extends Record<string, any>>(entity: T): FormData => {
    const formData = new FormData();

    Object.entries(entity).forEach(([key, value]) => {
        if (key === "image") {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value === null) {
                formData.append(key, "");
            }
            return;
        }
        if (value === null || value === undefined) return;
        formData.append(key, String(value));
    });


    return formData;
};

