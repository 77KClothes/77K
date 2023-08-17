import { Configuration } from './model';


export const config: Configuration = {
  apiUrl: 'http://localhost:8080',
  authUrl: 'http://localhost:8081',
  clientId: 'test',
  clientSecret: 'test',
  carausel: [
    {
      title: 'Naruto',
      text: '',
      imageUrl: 'https://i.pinimg.com/originals/92/b7/3c/92b73cd6467ceee125a99da4cf2f41c9.png'
    },
    {
      title: 'Demon Slayer',
      text: '',
      imageUrl: 'https://e1.pxfuel.com/desktop-wallpaper/52/680/desktop-wallpaper-tanjirou-kamado-kimetsu-no-yaiba-demon-slayer-banner.jpg'
    },
    {
      title: 'One Piece',
      text: '',
      imageUrl: 'https://i.pinimg.com/originals/5e/c5/4f/5ec54fc42e15d11ecc2d8a255217de8a.jpg'
    }
  ],
  bannerUrl: ''
};
