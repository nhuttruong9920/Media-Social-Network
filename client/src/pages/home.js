import React, { useEffect } from 'react'

import Status from '../components/home/Status'
import Posts from '../components/home/Posts'
import RightSideBar from '../components/home/RightSideBar'

import { useSelector } from 'react-redux'
import LoadIcon from '../images/loading.gif'


let scroll = 0;

const Home = () => {
    const { homePosts } = useSelector(state => state)

    // thêm e scroll
    window.addEventListener('scroll', () => {
        if(window.location.pathname === '/'){             // đường dẫn và tên tệp
            scroll = window.pageYOffset                   // tọa độ của cuộn
        
            return scroll;
        }
    })

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({top: scroll, behavior: 'smooth'})    // cuộn đến toạn độ scroll
        }, 100)          // hàm sẽ thực thi sau 0.1 giây
    },[])

    return (
        <div className="home row mx-0" style={{ position: "initial"}}>
            <div className="col-md-8">
                <Status />

                
                {
                    // list post
                    homePosts.loading 
                    ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                    : (homePosts.result === 0 && homePosts.posts.length === 0)
                        ? <h2 className="text-center">No Post</h2>
                        : <Posts />
                        
                }
                
            </div>
            
            <div className="col-md-4" style={{width: "30%"}}>
                <RightSideBar />
            </div>
            
        </div>
    )
}

export default Home
