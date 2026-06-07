import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Settings2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { UserRepo } from './WorkspaceBody'
import axios from 'axios'

type props = {
    repo: UserRepo,
    setReload: () => void;
}

function RepoSettings({ repo, setReload }: props) {

    const [isOpen, setIsOpen] = useState(false);

    const [repoSettings, setRepoSettings] = useState({
        targetDomain: repo?.targetDomain || '',
        globalInstruction: repo?.gloablInstruction || ''
    });

    const handleSaveSettings = async () => {
        try {
            const result = await axios.post('/api/user-repo/settings', {
                repoId: repo.repoId,
                targetDomain: repoSettings.targetDomain,
                globalInstruction: repoSettings.globalInstruction,
            });

            console.log(result.data);

            setIsOpen(false);
            setReload();

        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            {/* FIXED */}
            <DialogTrigger asChild>
                <Button>
                    <Settings2 className='h-4 w-4 mr-1' />
                    Project Config
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex gap-2 items-center'>
                        <Settings2 className='text-primary h-5 w-5' />
                        Project/Repo Settings
                    </DialogTitle>

                    <DialogDescription>
                        Configure project-level defaults used during script generation and execution.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div>
                        <label className='text-gray-500'>
                            APP URL / DEFAULT WEBSITE
                        </label>

                        <Input
                            value={repoSettings.targetDomain}
                            onChange={(e) =>
                                setRepoSettings({
                                    ...repoSettings,
                                    targetDomain: e.target.value
                                })
                            }
                            placeholder='App URL / Domain'
                            className='mt-1'
                        />

                        <p className='text-xs text-gray-400'>
                            The target address where automated headless browsers
                            will connect and run test cases.
                        </p>
                    </div>

                    <div className='mt-4'>
                        <label className='text-gray-500'>
                            GLOBAL TEST INSTRUCTION
                        </label>

                        <Textarea
                            value={repoSettings.globalInstruction}
                            onChange={(e) =>
                                setRepoSettings({
                                    ...repoSettings,
                                    globalInstruction: e.target.value
                                })
                            }
                            placeholder='Instructions'
                            className='mt-1'
                        />

                        <p className='text-xs text-gray-400'>
                            Include any authentication credentials, cookies,
                            setup, or teardown instructions. These are
                            automatically appended to Gemini prompts.
                        </p>
                    </div>
                </div>

                <DialogFooter>

                    {/* FIXED */}
                    <DialogClose asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button onClick={handleSaveSettings}>
                        Save Config
                    </Button>

                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default RepoSettings