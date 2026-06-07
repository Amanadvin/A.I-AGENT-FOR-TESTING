import WorkspaceHeader from '@/components/custom/WorkspaceHeader';
import React from 'react'

function WorkspaceLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className='mx-auto'>
            <WorkspaceHeader />
            {children}</div>

    )
}

export default WorkspaceLayout