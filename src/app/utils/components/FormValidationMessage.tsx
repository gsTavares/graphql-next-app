type FormValidationMessageProps = {
    message?: string
}

export default function FormValidationMessage({ message }: FormValidationMessageProps) {
    if(message) {
        return (
            <div className="pt-2 text-red-600 text-sm">
                { message }
            </div>
        )
    } else {
        return null;
    }
    
}