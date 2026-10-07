"use client";

import { FloppyDisk } from "@gravity-ui/icons";
import { type ComponentProps, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Description,
    FieldError,
    FieldGroup,
    Fieldset,
    Form,
    Input,
    Label,
    TextArea,
    TextField,
} from "@heroui/react";
import { updateUser, useSession } from "@/lib/auth-client";

export default function Profile() {
    const router = useRouter();
    const { data: session, isPending: isSessionPending, refetch } = useSession();

    const [profileName, setProfileName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [professionalTitle, setProfessionalTitle] = useState("");
    const [location, setLocation] = useState("");
    const [skills, setSkills] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [preferredJobType, setPreferredJobType] = useState("");
    const [workArrangement, setWorkArrangement] = useState("");
    const [preferredLocation, setPreferredLocation] = useState("");
    const [expectedSalary, setExpectedSalary] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        if (isSessionPending) {
            return;
        }

        if (!session?.user) {
            router.replace("/sign-in");
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setProfileName(session.user.name || "");
            setEmail(session.user.email);
            setBio(session.user.bio || "");
            setProfessionalTitle(session.user.professionalTitle || "");
            setLocation(session.user.location || "");
            setSkills(session.user.skills || "");
            setResumeUrl(session.user.resumeUrl || "");
            setGithubUrl(session.user.githubUrl || "");
            setLinkedinUrl(session.user.linkedinUrl || "");
            setPortfolioUrl(session.user.portfolioUrl || "");
            setPreferredJobType(session.user.preferredJobType || "");
            setWorkArrangement(session.user.workArrangement || "");
            setPreferredLocation(session.user.preferredLocation || "");
            setExpectedSalary(session.user.expectedSalary || "");
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [isSessionPending, router, session?.user]);

    const onSubmit: NonNullable<ComponentProps<typeof Form>["onSubmit"]> = async (event) => {
        event.preventDefault();
        setStatus(null);

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "").trim();

        if (name.length < 3) {
            setStatus({
                type: "error",
                message: "Name must be at least 3 characters.",
            });
            return;
        }

        setIsSaving(true);

        try {
            const result = await updateUser({
                name,
                bio: bio.trim(),
                professionalTitle: professionalTitle.trim(),
                location: location.trim(),
                skills: skills.trim(),
                resumeUrl: resumeUrl.trim(),
                githubUrl: githubUrl.trim(),
                linkedinUrl: linkedinUrl.trim(),
                portfolioUrl: portfolioUrl.trim(),
                preferredJobType: preferredJobType.trim(),
                workArrangement: workArrangement.trim(),
                preferredLocation: preferredLocation.trim(),
                expectedSalary: expectedSalary.trim(),
            });

            if (result.error) {
                setStatus({
                    type: "error",
                    message:
                        result.error.message ||
                        "Unable to update your profile.",
                });
                return;
            }

            await refetch();

            setStatus({
                type: "success",
                message: "Your profile has been updated.",
            });
        } catch {
            setStatus({
                type: "error",
                message:
                    "The authentication service is unavailable. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isSessionPending || !session?.user) {
        return (
            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4">
                <p className="text-sm text-slate-500">
                    Loading your profile...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">

                {/* Page Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Account
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Your Profile
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Manage your personal information and professional profile.
                    </p>
                </div>

                {/* Profile Overview */}
                <section className="mb-6 rounded-2xl border border-blue-500 bg-blue-400 p-6 shadow-2xl sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                            {profileName
                                ? profileName.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {profileName || "Your Name"}
                            </h2>

                            <p className="mt-1 text-sm text-black font-semibold">
                                {email}
                            </p>

                            <p className="mt-2 text-sm text-black">
                                Complete your profile to make your CareerFlow
                                account more useful for your job search.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Personal Information */}
                <Form
                    className="mb-6 w-full rounded-2xl border border-slate-300 bg-slate-200 p-6 shadow-slate-300 shadow-xl sm:p-8"
                    onSubmit={onSubmit}
                >
                    <Fieldset>
                        <Fieldset.Legend>
                            Personal information
                        </Fieldset.Legend>

                        <Description>
                            Update the information associated with your
                            CareerFlow account.
                        </Description>

                        <FieldGroup>
                            <TextField isRequired name="name">
                                <Label>Name</Label>

                                <Input
                                    value={profileName}
                                    onChange={(event) =>
                                        setProfileName(event.target.value)
                                    }
                                    placeholder="Enter your full name"
                                />

                                <FieldError />
                            </TextField>

                            <TextField name="email" type="email">
                                <Label>Email</Label>

                                <Input
                                    value={email}
                                    readOnly
                                />

                                <Description>
                                    Your email address cannot be changed here.
                                </Description>
                            </TextField>

                            <TextField name="bio">
                                <Label>Bio</Label>

                                <TextArea
                                    value={bio}
                                    onChange={(event) =>
                                        setBio(event.target.value)
                                    }
                                    placeholder="Tell employers a little about yourself..."
                                    rows={5}
                                />

                                <Description>
                                    Write a short introduction about your
                                    background, interests, or career goals.
                                </Description>
                            </TextField>
                        </FieldGroup>

                        {/* Professional Profile */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Professional profile
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add information that can help employers understand
                                    your professional background.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <Label>Professional title</Label>

                                    <Input
                                        name="professionalTitle"
                                        className="m-2"
                                        placeholder="e.g. Full Stack Developer"
                                        value={professionalTitle}
                                        onChange={(event) => setProfessionalTitle(event.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Location</Label>

                                    <Input
                                        name="location"
                                        className="m-2"
                                        placeholder="e.g. Dhaka, Bangladesh"
                                        value={location}
                                        onChange={(event) => setLocation(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-5">
                                <Label>Skills</Label>

                                <Input
                                    name="skills"
                                    className="m-2"
                                    placeholder="e.g. React, Next.js, Laravel, MySQL"
                                    value={skills}
                                    onChange={(event) => setSkills(event.target.value)}
                                />
                            </div>
                        </section>

                        {/* Resume & Links */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Resume & links
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Keep your professional documents and online
                                    profiles connected to your CareerFlow account.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* <div>
                                    <Label>Resume link</Label>
                                    <Input
                                        name="resumeUrl"
                                        className="mt-2"
                                        type="url"
                                        placeholder="https://example.com/resume.pdf"
                                        value={resumeUrl}
                                        onChange={(event) => setResumeUrl(event.target.value)}
                                    />
                                    <p className="mt-1 text-xs text-slate-500">
                                        Add a public link to your resume.
                                    </p>
                                </div> */}

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <Label>GitHub</Label>

                                        <Input
                                            name="githubUrl"
                                            className="m-2"
                                            type="url"
                                            placeholder="https://github.com/username"
                                            value={githubUrl}
                                            onChange={(event) => setGithubUrl(event.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label>LinkedIn</Label>

                                        <Input
                                            name="linkedinUrl"
                                            className="m-2"
                                            type="url"
                                            placeholder="https://linkedin.com/in/username"
                                            value={linkedinUrl}
                                            onChange={(event) => setLinkedinUrl(event.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Portfolio</Label>

                                    <Input
                                        name="portfolioUrl"
                                        className="m-2"
                                        type="url"
                                        placeholder="https://yourportfolio.com"
                                        value={portfolioUrl}
                                        onChange={(event) => setPortfolioUrl(event.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Job Preferences */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Job preferences
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Tell CareerFlow what kind of opportunities you&apos;re
                                    looking for.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <Label>Preferred job type</Label>

                                    <Input
                                        name="preferredJobType"
                                        className="m-2"
                                        placeholder="Full-time"
                                        value={preferredJobType}
                                        onChange={(event) => setPreferredJobType(event.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Work arrangement</Label>

                                    <Input
                                        name="workArrangement"
                                        className="m-2"
                                        placeholder="Remote / Hybrid / On-site"
                                        value={workArrangement}
                                        onChange={(event) => setWorkArrangement(event.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Preferred location</Label>

                                    <Input
                                        name="preferredLocation"
                                        className="m-2"
                                        placeholder="Dhaka, Bangladesh"
                                        value={preferredLocation}
                                        onChange={(event) => setPreferredLocation(event.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Expected salary</Label>

                                    <Input
                                        name="expectedSalary"
                                        className="m-2"
                                        placeholder="e.g. 50,000 BDT"
                                        value={expectedSalary}
                                        onChange={(event) => setExpectedSalary(event.target.value)}
                                    />
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-500">
                                These preferences help tailor the jobs you discover.
                            </p>
                        </section>

                        {status && (
                            <p
                                role={status.type === "error" ? "alert" : "status"}
                                className={status.type === "error" ? "text-sm text-red-600" : "text-sm text-green-600"}
                            >
                                {status.message}
                            </p>
                        )}

                        <Fieldset.Actions className="mt-8 border-t border-slate-200 pt-6">
                            <Button type="submit" isDisabled={isSaving}>
                                <FloppyDisk />
                                {isSaving ? "Saving..." : "Save changes"}
                            </Button>
                            <Button
                                type="reset"
                                variant="secondary"
                                onClick={() => {
                                    setProfileName(session.user.name || "");
                                    setBio(session.user.bio || "");
                                    setProfessionalTitle(session.user.professionalTitle || "");
                                    setLocation(session.user.location || "");
                                    setSkills(session.user.skills || "");
                                    setResumeUrl(session.user.resumeUrl || "");
                                    setGithubUrl(session.user.githubUrl || "");
                                    setLinkedinUrl(session.user.linkedinUrl || "");
                                    setPortfolioUrl(session.user.portfolioUrl || "");
                                    setPreferredJobType(session.user.preferredJobType || "");
                                    setWorkArrangement(session.user.workArrangement || "");
                                    setPreferredLocation(session.user.preferredLocation || "");
                                    setExpectedSalary(session.user.expectedSalary || "");
                                    setStatus(null);
                                }}
                            >
                                Cancel
                            </Button>
                        </Fieldset.Actions>
                    </Fieldset>
                </Form>
            </div>
        </main>
    );
}