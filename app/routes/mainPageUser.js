import mainPageUser from '../controllers/mainPageUser';

export default function(app){
    app.get('/main-mage-user', mainPageUser.pageUser);
}