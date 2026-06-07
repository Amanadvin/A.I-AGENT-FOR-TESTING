"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import EmptyWorkspace from './EmptyWorkspace';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import RepoDialog, { Repo } from './RepoDialog';
import UserRepoList from './UserRepoList';

export type UserRepo = {
    id: number;
    repoId: number;
    name: string;
    fullName: string;
    private: boolean;
    htmlUrl: string;
    description: string;
    userId: number;
    owner: string;
    updatedAt: string;
    language: string;
    defaultBranch: string;
    targetDomain?: string;
    gloablInstruction?: string;
}

function WorkspaceBody() {


    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter()
    const [token, setToken] = useState('');
    const [userRepoList, setUserRepoList] = useState<UserRepo[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        GetGithubUserToken();

    }, [])

    useEffect(() => {
        userDetail?.id && GetUserAddedRepoList();
    }, [userDetail?.id])

    const GetGithubUserToken = async () => {
        const result = await axios.get('/api/github/token');
        console.log(result.data.token)
        setToken(result.data.token);
    }

    const OnAddRepo = async () => {
        router.push('/api/github');
    }

    const GetUserAddedRepoList = async () => {
        setLoading(true);
        const result = await axios.get('/api/user-repo?userId=' + userDetail?.id);
        console.log(result.data);
        setUserRepoList(result.data);
        setLoading(false);
    }


    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='text-4xl font-medium'>Workspace</h2>
                <h2 className='text-blue-800 bg-blue-100 px-2 rounded-lg'>Remaining Credits: {userDetail?.credits}</h2>
            </div>


            <Card className={'mt-5 flex justify-between items-center p-4 border rounded-lg'}>
                <div className='flex items-center gap-5'>
                    <Image src={'/github.png'} alt='github' width={40} height={40} />
                    <h2 className='text-lg' >Connect Github & Add Repository</h2>
                </div>
                <div>

                    {!token ? <Button onClick={OnAddRepo}>Setup</Button>
                        : <RepoDialog setRefreshPage={(refresh: boolean) => GetUserAddedRepoList()} />}
                </div>
            </Card>

            {loading ? (
                <div className='mt-10'>
                    <div className='my-3 bg-slate-200 animate-pulse w-32 h-6 rounded'></div>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className='w-full h-16 bg-slate-200 animate-pulse rounded-xl mb-5'></div>
                    ))}
                </div>
            ) : userRepoList?.length === 0 ? (
                <Card className='mt-10'>
                    <CardContent>
                        <EmptyWorkspace />
                    </CardContent>
                </Card>
            ) : (
                <UserRepoList repoList={userRepoList} setReload={() => GetUserAddedRepoList()} />
            )}


        </div>
    )
}

export default WorkspaceBody