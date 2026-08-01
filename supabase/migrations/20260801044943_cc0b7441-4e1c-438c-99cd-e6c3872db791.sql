ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

INSERT INTO public.notifications (title, body, channel, link, pinned) VALUES
('GOOGLE DRIVE LINK LAUNCHED FOR NEW BOOKS 🎊 📚', 'Click https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg for viewing books. New books will also be uploaded here and on telegram channel also.', 'general', 'https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg', true),
('PW QCB Science Class 10', 'PW QCB Science Class 10 available in Google Drive Link 🔗 posted in Notifications section', 'books', 'https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg', false),
('PW QCB Maths Class 10', 'PW QCB Maths Class 10 available in Google Drive Link 🔗 posted in Notifications section', 'books', 'https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg', false),
('Padhle Akshay TYQs Class 10', 'Padhle Akshay TYQs Class 10 available in Google Drive Link 🔗 posted in Notifications section', 'books', 'https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg', false),
('Educart Science Question Bank Class 10', 'Educart Science Question Bank Class 10 available in Google Drive Link 🔗 posted in Notifications section', 'books', 'https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg', false),
('Educart SST Question Bank Class 10', 'Educart SST Question Bank Class 10 available in Google Drive Link 🔗 posted in Notifications section', 'books', 'https://drive.google.com/drive/folders/1-3HuJpns7sRB5fGJqfjgg1FOtRRuzotg', false);