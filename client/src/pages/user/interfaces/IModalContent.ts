export default interface IModalContent {
    title: string;
    body: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    onConfirm: () => void;
}