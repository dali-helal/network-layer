import { toast } from 'react-toastify';

class NotificationService {
    public static showError(message: string) {
        toast.error(message);
    }

    public static showSuccess(message: string) {
        toast.success(message);
    }

    // Show the UnauthorizedModal
    public static showUnauthorizedModal() {

    }
}

export default NotificationService;
