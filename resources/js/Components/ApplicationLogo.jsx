export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/logo.png" // Path to your logo in the storage folder
            alt="Volunteer Faster Logo"
        />
    );
}
