import AddTask from '@/components/AddTask'
import DateTimeFilter from '@/components/DateTimeFilter'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StatsAndFilters from '@/components/StatsAndFilters'
import TaskList from '@/components/TaskList'
import TaskListPagination from '@/components/TaskListPagination'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const HomePage = () => {
    const [taskBuffer, setTaskBuffer] = useState([]);
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [completeTaskCount, setCompleteTaskCount] = useState(0);
    const [filter, setFilter] = useState('all');
    const [dateQuery, setDateQuery] = useState('today');
    useEffect(() => {
        fetchTask();
    }, [dateQuery])
    const fetchTask = async () => {
        try {
            const res = await api.get(`/tasks?filter=${dateQuery}`);
            setTaskBuffer(res.data.tasks);
            setActiveTaskCount(res.data.activeCount);
            setCompleteTaskCount(res.data.completeCount);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks. Please try again later.');
        }
    }

    const handleTaskChanged = () => {
        fetchTask();
    }

    const filteredTasks = taskBuffer.filter((task) => {
        switch (filter) {
            case 'active':
                return task.status === 'active';
            case 'completed':
                return task.status === 'complete';
            default:
                return true;
        }
    })

    return (
        <div className="min-h-screen w-full bg-[#fefcff] relative">
            {/* Dreamy Sky Pink Glow */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
                }}
            />
            {/* Your Content/Components */}
            <div className='container pt-8 mx-auto relative z-10'>
                <div className='w-full max-w-2xl p-6 mx-auto space-y-6'>
                    {/* Đầu trang */}
                    <Header />
                    {/* Tạo task */}
                    <AddTask handleNewTaskAdded={handleTaskChanged} />
                    {/* Thống kê và bộ lọc */}
                    <StatsAndFilters
                        filter={filter}
                        setFilter={setFilter}
                        activeTasksCount={activeTaskCount}
                        completedTasksCount={completeTaskCount}
                    />
                    {/* Danh sách nhiệm vụ */}
                    <TaskList
                        filteredTasks={filteredTasks}
                        filter={filter}
                        handleTaskChanged={handleTaskChanged}
                    />
                    {/* Phân trang và lọc theo Date */}
                    <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
                        <TaskListPagination />
                        <DateTimeFilter
                            dateQuery={dateQuery}
                            setDateQuery={setDateQuery}
                        />
                    </div>
                    {/* Chân trang */}
                    <Footer
                        activeTasksCount={activeTaskCount}
                        completedTasksCount={completeTaskCount}
                    />
                </div>
            </div>
        </div>




    )
}

export default HomePage