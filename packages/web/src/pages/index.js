import React from 'react';

import Layout from '../components/Layout';
import Header from '../components/Header';
import Home from '../components/Home';
import Footer from '../components/Footer';

const IndexPage = () => {
    return (
        <Layout>
            <Header />
            <Home />
            <Footer />
        </Layout>
    );
};

export default IndexPage;
