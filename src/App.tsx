import * as React from 'react';
import {Layout, Menu} from 'antd';
import 'antd/dist/antd.css';
import {PieChartOutlined} from '@ant-design/icons';
import {Route, Switch } from 'react-router-dom';
import {Product} from "./pages/Product";
import './Main.css'
import {useState} from "react";
import {observer} from "mobx-react";
import {ModalWrapper} from "./modal/ModalWrapper";
import {ModalContext} from "./index";
import {Category} from "./pages/Category";
import { Link } from 'react-router-dom'
import {News} from "./pages/News";
import {Feedbacks} from "./pages/feedbacks";
import {OrdersPage} from "./pages/OrdersPage";
import { VacansyPage } from './pages/VacansyPage';
import {Navlinks} from "./pages/Navlinks";

const {Header, Sider, Content} = Layout;
const menuItems = [
    {
        key: 'Продукты',
        link: '/products'
    },
    {
        key: 'Новости',
        link: '/news'
    },
    {
        key:'Заказы',
        link: '/orders'
    },
    {
        key: 'Фидбэки',
        link: '/feedbacks'
    },
    {
        key: 'Категории продуктов',
        link: '/categories'
    },
    {
        key: 'Вакансии',
        link: '/vacansy'
    },
    {
        key: 'Навигационные ссылки',
        link: '/navlinks'
    }
]



export const useModal = () => {
    const store = React.useContext(ModalContext)
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.')
    }
    return store
}

const  App = observer(()=>{
    const [activePage, setActivePage] = useState('Продукты');
    return (
        <Layout>
            <ModalWrapper/>
            <Sider  collapsible style={{height: '2000px'}}>
                <div className="logo" />
                <Menu theme="dark">
                    {
                        menuItems.map((item,index) =>
                            <Menu.Item key={item.key} onClick={()=>setActivePage(item.key)} icon={<PieChartOutlined/>} >
                                <Link to={item.link}>
                                    {item.key}
                                </Link>
                            </Menu.Item>
                        )
                    }
                </Menu>
            </Sider>
            <Layout>
                <Header className="site-layout-background" >
                    <span className={'ant-page-header-heading-title'}>/{activePage}</span>
                </Header>
                <Content style={{ margin: '20px 30px' }} >
                    <Switch>
                        <Route path='/' exact component={Product}/>
                        <Route path='/products' exact component={Product}/>
                        <Route path={'/categories'} component={Category}/>
                        <Route path={'/news'} component={News}/>
                        <Route path={'/feedbacks'} component={Feedbacks}/>
                        <Route path={'/orders'} component={OrdersPage}/>
                        <Route path={'/vacansy'} component={VacansyPage}/>
                        <Route path={'/navlinks'} component={Navlinks}/>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
})


export default App;
