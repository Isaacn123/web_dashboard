FROM python:3.13

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /webapp

RUN apt-get update && apt-get upgrade -y && apt-get clean

COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .    

CMD ["gunicorn", "mysite.wsgi:application", "--bind", "0.0.0.0:8000"]