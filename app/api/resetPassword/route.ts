import { NextRequest, NextResponse } from 'next/server';
import { getAuth, confirmPasswordReset, signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(request: NextRequest) {
    const { oldPassword, newPassword, oobCode } = await request.json();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        return NextResponse.json({ message: "User not logged in." }, { status: 401 });
    }

    try {
        // Re-authenticate the user with the old password
        await signInWithEmailAndPassword(auth, user.email!, oldPassword);
    } catch (error) {
        return NextResponse.json({ message: "Old password is incorrect." }, { status: 400 });
    }

    if (newPassword === oldPassword) {
        return NextResponse.json({ message: "New password must be different from the old password." }, { status: 400 });
    }

    if (!oobCode) {
        return NextResponse.json({ message: "Invalid or missing reset code." }, { status: 400 });
    }

    try {
        await confirmPasswordReset(auth, oobCode, newPassword);
        return NextResponse.json({ message: "Password reset successful!" });
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ message: "Error resetting password. Please try again." }, { status: 500 });
    }
}
