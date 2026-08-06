UPDATE public.notifications SET channel = 'books_class10' WHERE channel = 'books';

INSERT INTO public.notifications (title, body, channel, link, pinned)
VALUES ('Oswaal QB Maths Class 10 available in Google Drive Link 🔗 posted in Notifications section', 'New book drop — check the Google Drive link posted in the Notifications section.', 'books_class10', 'https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg', false);